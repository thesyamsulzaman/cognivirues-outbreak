import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState(
    new URLSearchParams(location.search)
  );

  useEffect(() => {
    setQueryParams(new URLSearchParams(location.search));
  }, [location.search]);

  const getQueryParam = (key: string): string | null => {
    return queryParams.get(key);
  };

  const setQueryParam = (key: string, value: string) => {
    queryParams.set(key, value);
    navigate({ search: queryParams.toString() });
  };

  const removeQueryParam = (key: string) => {
    queryParams.delete(key);
    navigate({ search: queryParams.toString() });
  };

  const setBatchQueryParams = (params: Record<string, string>) => {
    for (const key in params) {
      if (Array.isArray(params[key])) {
        const queryIsEmpty = !params[key]?.length;

        if (queryIsEmpty) {
          queryParams.delete(`${key}[]`);
        }

        params[key]?.forEach((value: any) => {
          if (params[key]) {
            queryParams.append(`${key}[]`, value);
          }
        });
      } else {
        const queryIsEmpty = isEmpty(params[key]);

        if (queryIsEmpty) {
          queryParams.delete(`${key}`);
        }

        if (params[key]) {
          queryParams.append(`${key}`, params[key]);
        }
      }
    }

    navigate({ search: queryParams.toString() });
  };

  return {
    getQueryParam,
    setQueryParam,
    removeQueryParam,
    queryParams,
    setBatchQueryParams,
  };
};

export default useQueryParams;
