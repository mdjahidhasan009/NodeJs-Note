import 'reflect-metadata';
import {container} from 'tsyringe';

import { A } from './A';
import {B} from "./B";

const AService = container.resolve(A);
const BService = container.resolve(B);