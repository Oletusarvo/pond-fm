import { Knex } from "knex";
import { db } from "../db-config";
import { UserRepository } from "../repositories/user-repository";
import { tablenames } from "../tablenames";
import { DBContext } from "../types/db-context";
import {
  ServiceErrorResponse,
  ServiceResponse,
  ServiceSuccessResponse,
} from "../types/service-response";
import crypto from "crypto";
import { findUserById } from "../DAL/users/find-user-by-id";
import { getLookupQuery } from "../DAL/util/get-lookup-query";
import { serviceError } from "../utils/service-error";

export class UserService {
  constructor(private repo: UserRepository) {}
}
