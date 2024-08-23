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
  const [page, setPage] = useState(1);

  useEffect(() => {
    // cl(app, model, token, 'mv-----');
    const getModels = async () => {
      const res_models = await modelGet(token, app, model, -1, page);
      setModels(res_models);
      // cl(res_models, "res");
    };
    getModels();
  }, [token, page]);
  // cl(models, "preformat");
  return <ModelFormat models={models}  page={ setPage} />;
};

export default ModelView;

interface RespModelData {
  count: number;
  next: string | null;
  previous: string | null;
  results: [Object];
}

const ModelFormat = ({models:modelData, page:setPage}) => {
  // Format model fields and data
  if (!modelData.results) return <></>;
  cl(modelData.results)
  const modelKeys = Object.keys(modelData.results.pop() || {});
  if (modelKeys[0] === "id") modelKeys.shift();
  const next = modelData.next ? modelData.next.split("=").pop() : null;
  const prev = modelData.previous ? modelData.previous.split("=").pop() : null;

  const pager = (n: number) => {
    if (isNaN(n)) {n=1};
    setPage(n)
  }
  const mapped_models: Array<JSX.Element> = modelData.results.map((model: {}, idx) => {
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
      <div className="pagination">
        <p className="prev">
          {prev && <button  className='btn btn-tertiary m-2' onClick={() => {pager(parseInt(prev))}}>Previous</button>}
        </p>
        <p className="next">
          {next && <button className=' btn btn-tertiary m-2' onClick={()=>{pager(parseInt(next))}}>Next</button>}
        </p>
      </div>
    </Container>
  );
};
