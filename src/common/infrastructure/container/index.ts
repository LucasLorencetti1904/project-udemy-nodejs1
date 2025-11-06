import "@/products/infrastructure/container";
import "@/users/infrastructure/container";
import { container } from "tsyringe";
import BcryptStringHashProvider from "@/common/infrastructure/providers/BcryptStringHashProvider";

container.registerSingleton("StringHashProvider", BcryptStringHashProvider)