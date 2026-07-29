import { AuthRepository } from './repositories/auth-repository';
import { PaymentRepository } from './repositories/payment-repository';
import { PostRepository } from './repositories/post-repository';
import { UserRepository } from './repositories/user-repository';
import { AuthService } from './services/auth-service';
import { PaymentService } from './services/payment-service';
import { PostService } from './services/post-service';
import { UserService } from './services/user-service';

export const postService = new PostService(new PostRepository());
export const userService = new UserService(new UserRepository());
export const authService = new AuthService(new AuthRepository());
export const paymentService = new PaymentService(new PaymentRepository());
