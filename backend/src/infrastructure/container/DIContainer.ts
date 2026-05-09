import { Container } from "inversify";
import { ServiceFactory } from "./factories/ServiceFactory";
import { RepositoryFactory } from "./factories/RepositoryFactory";
import { UseCaseFactory } from "./factories/UseCaseFactory";
import { ControllerFactory } from "./factories/ControllerFactory";
import { AdminFactory } from "./factories/AdminFactory";
import { AdminDriverFactory } from "./factories/AdminDriverFactory";
import { DriverFactory } from "./factories/DriverFactory";
import { UserFactory } from "./factories/UserFactory";
import { FileFactory } from "./factories/FileFactory";
import { DriverAvailabilityFactory } from "./factories/DriverAvailabilityFactory";
import { FareCalculationFactory } from "./factories/FareConfigurationFactory";
import { RideRequestFactory } from "./factories/RideRequestFactory";
import { NotificationFactory } from "./factories/NotificationFactory";
import { PaymentFactory } from "./factories/PaymentFactory";
import { ChatFactory } from "./factories/ChatFactory";
import { EventHandlersFactory } from "./factories/EventHandlersFactory";
import { FutureRideRequestFactory } from "./factories/FutureRideRequestFactory";

const container = new Container();

// Register dependencies using factories
ServiceFactory.register(container);
RepositoryFactory.register(container);
UseCaseFactory.register(container);
ControllerFactory.register(container);
AdminFactory.register(container);
AdminDriverFactory.register(container);
DriverFactory.register(container);
UserFactory.register(container);
FileFactory.register(container);
DriverAvailabilityFactory.register(container);
FareCalculationFactory.register(container);
RideRequestFactory.register(container);
NotificationFactory.register(container);
NotificationFactory.registerRealtimePublisher(container);
PaymentFactory.register(container);
ChatFactory.register(container);
EventHandlersFactory.register(container);
EventHandlersFactory.init(container);
FutureRideRequestFactory.register(container);

export { container };
