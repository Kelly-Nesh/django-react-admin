import "./navbar.css";
import { Accordion } from "react-bootstrap";
import { AppsModels } from "./navbar";
import { cl } from "../../App";

export const ModelMap = (data: AppsModels) => {
  // Checks permissions of models and sets auth app as the first in models list
  if (!data || !data.models) return <></>;
  let models: Array<string> = Object.keys(data.models).sort();

  const auth_idx = models.findIndex((a) => a === "auth");
  if (auth_idx > -1) {
    models = models.slice(0, auth_idx).concat(models.slice(auth_idx + 1));
    models.unshift("auth");
  }
  const hasModelViewPermission = (app: string, model: string) => {
    if (!data.perms) return false;
    // cl(`${app}.view_${model}`);
    return data.perms.find((r) => r === `${app}.view_${model.toLowerCase()}`);
  };

  const mapped_apps = models.map((key: string) => {
    const p_models: Array<JSX.Element> = [];
    data.models[key].forEach((m: string) => {
      if (hasModelViewPermission(key, m)) {
        p_models.push(<p className="m-0 mb-1" key={m}>{m}</p>);
      }
    });
    // cl(p_models);
    if (p_models.length > 0) {
      return (
        <Accordion.Item eventKey={key} key={key}>
          <Accordion.Header>{key}</Accordion.Header>
          <Accordion.Body>{p_models}</Accordion.Body>
        </Accordion.Item>
      );
    }
  });
  return <>{mapped_apps}</>;
};

export default ModelMap;
