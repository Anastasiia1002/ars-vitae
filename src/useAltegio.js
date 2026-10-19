import { useEffect, useState } from "react";
import { loadCatalog, loadCompany, loadPublicStaff } from "./altegio.js";

export function useCompany() {
  const [state, setState] = useState({ status: "loading", company: null });

  useEffect(() => {
    let cancel = false;
    loadCompany()
      .then((company) => {
        if (!cancel) setState({ status: "ready", company });
      })
      .catch(() => {
        if (!cancel) setState({ status: "error", company: null });
      });
    return () => {
      cancel = true;
    };
  }, []);

  return state;
}

export function useCatalog() {
  const [state, setState] = useState({
    status: "loading",
    services: [],
    categories: [],
  });

  useEffect(() => {
    let cancel = false;
    loadCatalog()
      .then((catalog) => {
        if (!cancel) setState({ status: "ready", ...catalog });
      })
      .catch(() => {
        if (!cancel) setState({ status: "error", services: [], categories: [] });
      });
    return () => {
      cancel = true;
    };
  }, []);

  return state;
}

export function usePublicStaff() {
  const [state, setState] = useState({ status: "loading", staff: [] });

  useEffect(() => {
    let cancel = false;
    loadPublicStaff()
      .then((staff) => {
        if (!cancel) setState({ status: "ready", staff: Array.isArray(staff) ? staff : [] });
      })
      .catch(() => {
        if (!cancel) setState({ status: "error", staff: [] });
      });
    return () => {
      cancel = true;
    };
  }, []);

  return state;
}
