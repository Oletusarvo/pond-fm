import { Subscription } from "stripe";
import { db } from "../../../../../../db-config";
import { tablenames, viewnames } from "../../../../../../tablenames";
import { TSubscription, TSubscriptionInsert, TTrack } from "@pondfm/app-shared";
import { TUploadFolder } from "@pondfm/app-shared/dist/types/upload-folder";

export async function customerSubscriptionDeleted(subscription: Subscription) {
  /*
    Return the relevant subscription back to a free-plan. 
    Delete oldest files that contribute to quota overage.
  */
  const userId = subscription.metadata.subscription_user_id;
  //Update the user to a free plan beforehand so the quota calculations reflect their new plan state.
  const subscriptionRowsAffected = await db(tablenames.subscriptions)
    .where({
      stripe_subscription_id: subscription.id,
    } as TSubscription)
    .update({
      plan_id: "free",
      cancel_at_period_end: null,
      current_period_end: null,
      current_period_start: null,
      status: "active",
    } as TSubscriptionInsert);

  if (subscriptionRowsAffected == 0) {
    return;
  }

  const localSubscription = (await db({
    subscription: viewnames.subscriptions,
  })
    .where({ "subscription.user_id": userId } as {
      "subscription.user_id": TSubscription["user_id"];
    })
    .select(
      "subscription.user_id",
      "subscription.storage_quota_bytes",
      "subscription.storage_quota_consumed",
    )
    .first()) as Pick<
    TSubscription,
    "user_id" | "storage_quota_bytes" | "storage_quota_consumed"
  >;

  const storageQuotaConsumed = BigInt(localSubscription.storage_quota_consumed);
  const storageQuota = BigInt(localSubscription.storage_quota_bytes);

  const quotaOverage =
    storageQuotaConsumed > storageQuota
      ? storageQuotaConsumed - storageQuota
      : 0n;

  const uploadStream = db({ track: viewnames.tracks })
    .where({ author_id: localSubscription.user_id } as TTrack)
    .select(
      "size_bytes AS size",
      "upload_folder_id",
      "track.id",
      "track.created_at",
    )
    .orderBy("track.created_at", "asc")
    .stream();

  await db.transaction(async (trx) => {
    let sizeDeleted: bigint = 0n;
    for await (const track of uploadStream) {
      if (sizeDeleted >= quotaOverage) break;

      await trx(tablenames.uploadFolders)
        .where({
          id: track.upload_folder_id,
        } as TUploadFolder)
        .update({ status: "deleted" } as TUploadFolder);
      sizeDeleted += BigInt(track.size);
    }

    await trx(tablenames.subscriptions)
      .where({
        stripe_subscription_id: subscription.id,
      } as TSubscription)
      .update({
        stripe_subscription_id: null,
      } as TSubscription);
  });
}
