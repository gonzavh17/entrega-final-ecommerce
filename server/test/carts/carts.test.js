import mongoose from "mongoose";
import chai from "chai";
import supertest from "supertest";
import logger from "../../src/utils/loggers.js";
import 'dotenv/config';

const expect = chai.expect;
const requester = supertest(process.env.APP_URL + process.env.APP_PORT);