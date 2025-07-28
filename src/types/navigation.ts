import { Property } from "./property";

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ChooseRole: undefined;
    AddProperty: undefined;
    PropertyList: undefined;
    RealtorDashboard: undefined;
    BuyerDashboard: undefined;
    EditProperty: { property: Property };
  };