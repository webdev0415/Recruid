import { ROUTES } from "routes";
import mainMenuGenerator from "constants/menus/main";
import candidateMenuGenerator from "constants/menus/candidateProfile";
import clientMenuGenerator from "constants/menus/clientProfile";
import contactMenuGenerator from "constants/menus/contactProfile";
import dealMenuGenerator from "constants/menus/dealProfile";
import emailMenuGenerator from "constants/menus/emailProfile";
import vendorMenuGenerator from "constants/menus/vendorProfile";
import jobMenuGenerator from "constants/menus/jobProfile";
import tempJobMenuGenerator from "constants/menus/tempJobProfile";
import timesheetMenuGenerator from "constants/menus/TimesheetProfile";

const menuGenerator = (store) => {
  if (store.company && store.role) {
    return {
      [ROUTES.CandidateProfile.path]: candidateMenuGenerator(store),
      [ROUTES.ClientProfile.path]: clientMenuGenerator(store),
      [ROUTES.ContactProfile.path]: contactMenuGenerator(store),
      [ROUTES.DealProfile.path]: dealMenuGenerator(store),
      [ROUTES.JobDashboard.path]: jobMenuGenerator(store),
      [ROUTES.TempJobDashboard.path]: tempJobMenuGenerator(store),
      [ROUTES.VendorPage.path]: vendorMenuGenerator(store),
      [ROUTES.EmailProfile.path]: emailMenuGenerator(store),
      [ROUTES.TimesheetManager.path]: timesheetMenuGenerator(store),
      main: mainMenuGenerator(store),
    };
  } else return {};
};

export default menuGenerator;
