import { AuthRepository } from "./repositories/auth-repository";
import { PaymentRepository } from "./repositories/payment-repository";
import { PostRepository } from "./repositories/post-repository";
import { ScrobbleRepository } from "./repositories/scrobble-repository";
import { UserRepository } from "./repositories/user-repository";
import { TrackHandlerService } from "./handler-services/track-handler-service";
import { AuthService } from "./business-services/auth-service";
import { PaymentService } from "./business-services/payment-service";
import { PostService } from "./business-services/post-service";
import { ScrobbleService } from "./business-services/scrobble-service";
import { UserService } from "./business-services/user-service";
import { EmailService } from "./business-services/email-service";
import { loadEnvVariable } from "@pondfm/server-utils";

/**Provides services for business-logic. */
export const services = {
  posts: new PostService({ postRepo: new PostRepository() }),
  users: new UserService(new UserRepository()),
  payments: new PaymentService(new PaymentRepository()),
  scrobbles: new ScrobbleService(new ScrobbleRepository()),
  auth: new AuthService({
    users: new UserRepository(),
    auth: new AuthRepository(),
  }),
  emails: new EmailService(
    "https://api.brevo.com/v3/smtp/email",
    loadEnvVariable("EMAIL_API_KEY"),
  ),
};

/**Provides services for request handling. */
export const handlers = {
  tracks: new TrackHandlerService(),
};
