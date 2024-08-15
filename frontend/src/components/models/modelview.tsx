import "./modelview.css";
import { useContext, useEffect, useState } from "react";
import { cl, TokenContext } from "../../App";
import { modelGet } from "../../services/crud/model_crud";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

const ModelView = () => {
  const [models, setModels] = useState([]);
  const token = useContext(TokenContext).access_token;
  const { app, model } = useParams();
  useEffect(() => {
    // cl(app, model);
    const getModels = async () => {
      const res_models = await modelGet(token, app, model);
      setModels(res_models);
      // cl(res_models, "res");
    };
    getModels();
  }, [token]);
  // cl(models, "preformat");
  return <ModelFormat props={models} />;
};

export default ModelView;

const ModelFormat = ({ props: modelData }: { props: [Object] }) => {
  // Format model fields and data

  // cl(modelData);
  if (!modelData) return <></>;
  const modelKeys = Object.keys(modelData.pop() || {});
  if (modelKeys[0] === "id") modelKeys.shift();

  const mapped_models: Array<JSX.Element> = modelData.map((model: {}, idx) => {
    return (
      <tr key={idx}>
        {modelKeys.map((key: string) => {
          // cl(key, model, model[key]);
          return (
            <td
              className="text-truncate table-border"
              // style={{ width: `${100 / modelKeys.length}%` }}
              key={key}
            >
              <a href={`edit/${model["id"]}/`}>{model[key]}</a>
            </td>
          );
        })}
      </tr>
    );
  });
  // cl(mapped_models, "mapped");
  return (
    <Container>
      <table className="overflow-x-scroll table-border w-100">
        <thead>
          <tr>
            {modelKeys.map((key, idx) => {
              return (
                <th key={key + idx} className="text-capitalize table-border">
                  {key}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{mapped_models}</tbody>
      </table>
    </Container>
  );
};
