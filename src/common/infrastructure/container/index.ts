import "@/products/infrastructure/container";
import "@/users/infrastructure/container";
import { container } from "tsyringe";
import BcryptStringHashProvider from "@/common/infrastructure/providers/stringHashProviders/BcryptStringHashProvider";
import JwtAuthenticationProvider from "@/common/infrastructure/providers/authenticationProviders/JwtAuthenticationProvider";
import LocalFileStorageProvider from "@/common/infrastructure/providers/fileStorageProviders/LocalFileStorageProvider";

container.registerSingleton("StringHashProvider", BcryptStringHashProvider);
container.registerSingleton("AuthenticationProvider", JwtAuthenticationProvider);
container.registerSingleton("FileStorageProvider", LocalFileStorageProvider);