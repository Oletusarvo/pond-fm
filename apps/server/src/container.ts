import { AuthRepository } from './repositories/auth-repository';
import { PaymentRepository } from './repositories/payment-repository';
import { PostRepository } from './repositories/post-repository';
import { ScrobbleRepository } from './repositories/scrobble-repository';
import { UserRepository } from './repositories/user-repository';
import { AuthService } from './services/auth-service';
import { PaymentService } from './services/payment-service';
import { PostService } from './services/post-service';
import { ScrobbleService } from './services/scrobble-service';
import { UserService } from './services/user-service';

export const postService = new PostService({ postRepo: new PostRepository() });
export const userService = new UserService(new UserRepository());
export const authService = new AuthService({
  authRepo: new AuthRepository(),
  userRepo: new UserRepository(),
});
export const paymentService = new PaymentService(new PaymentRepository());
export const scrobbleService = new ScrobbleService(new ScrobbleRepository());
