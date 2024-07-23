import { Accordion } from "react-bootstrap";
import { AppsModels } from "./navbar";

export const ModelMap = (data: AppsModels) => {
  // Checks permissions of models and sets auth app as the first in models list
  if (!data || !data.models) return <></>;
  let models: Array<string> = Object.keys(data.models).sort();

  const auth_idx = models.findIndex((a) => a === "auth");
  if (auth_idx > -1) {
    models = models.slice(0, auth_idx).concat(models.slice(auth_idx + 1));
    models.unshift("auth");
  }

  const mapped_models = models.map((key: string) => {
    return (
      <Accordion.Item eventKey={key}>
        <Accordion.Header>{key}</Accordion.Header>
        <Accordion.Body>
          {data.models &&
            data.models[key].map((m: any) => <p className="m-0 mb-1">{m}</p>)}
        </Accordion.Body>
      </Accordion.Item>
    );
  });
  return <>{mapped_models}</>;
};

export default ModelMap;

// check if auth app is present
// get the index and pop/remove
// unshift it to first index
