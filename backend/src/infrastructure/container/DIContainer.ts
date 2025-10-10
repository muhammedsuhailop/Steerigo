import { Container } from "inversify";
import { ServiceFactory } from "./factories/ServiceFactory";
import { RepositoryFactory } from "./factories/RepositoryFactory";
import { UseCaseFactory } from "./factories/UseCaseFactory";
import { ControllerFactory } from "./factories/ControllerFactory";
import { AdminFactory } from "./factories/AdminFactory";
import { AdminDriverFactory } from "./factories/AdminDriverFactory";

const container = new Container();

// Register dependencies using factories
ServiceFactory.register(container);
RepositoryFactory.register(container);
UseCaseFactory.register(container);
ControllerFactory.register(container);
AdminFactory.register(container);
AdminDriverFactory.register(container);

export { container };
