import { TUser } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getAuthTokenQuery } from "./get-auth-token-query";

export async function findValidTokenByCode(ctx: DBContext, config: { code: string }) {
  const query = getAuthTokenQuery(ctx);

  return await query.where({ code: config.code, is_used: false })
    .andWhereRaw('CURRENT_TIMESTAMP < expires_at')
    .select('auth_tokens.id', 'user_id', 'user.email as user_email')
    .first() as {
      id: string;
      user_id: TUser['id'];
      user_email: TUser['email'];
    };
}