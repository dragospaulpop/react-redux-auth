import { useSelector, useDispatch } from "react-redux";
import { changeName } from "./store";
import { useCallback, useEffect, useState } from "react";

import supabase from "./supabase";

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const [localUser, setLocalUser] = useState(user);
  const dispatch = useDispatch();
  const changeUser = (value) => {
    dispatch(changeName({ name: value }));
  };

  const [clients, setClients] = useState<any>([]);
  const [clientsAdded, setClientsAdded] = useState(0);

  // read the clients table only once, when page loads (empty dependency array)
  useEffect(() => {
    const signIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "froind@gmail.com",
        password: "TestTest1!",
      });

      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    const fetchClients = async () => {
      const { data, error } = await supabase.from("clients").select();

      if (error) {
        console.error(error);
      } else {
        setClients(data);
        console.log(data);
      }
    };

    const signInAndFetchClients = async () => {
      await signIn();
      await fetchClients();
    };

    signInAndFetchClients();
  }, []);

  // OR
  // thse 2 approaches are mutually exclusive

  // read the clients table every time a new client is added
  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from("clients").select();

      if (error) {
        console.error(error);
      } else {
        setClients(data);
        console.log(data);
      }
    };

    fetchClients();
  }, [clientsAdded]);

  // add a new client and update the clientsAdded state so that the
  // component re-renders and the table is updated (by running the
  // second useEffect - the one that has the dependency array with
  // clientsAdded)

  // useCallback is a way to memoize the function so that it is only
  // created once and re-used when the dependencies change
  // chestie de optimizare; putem folosi a normal function
  const addClient = useCallback(async () => {
    const { data, error } = await supabase.from("clients").insert({
      name: "New client",
      email: `new@client${new Date().getTime()}.com`,
      surname: "New",
      address: "New address",
    });

    if (error) {
      console.error(error);
    } else {
      setClientsAdded(clientsAdded + 1);
      console.log(data);
    }
  }, [clientsAdded]);

  return (
    <div className="p-4 grid gap-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div>
        Your name:
        <input
          className="p-2 border border-gray-300 rounded mx-2 text-black"
          type="text"
          value={localUser}
          onChange={(e) => setLocalUser(e.target.value)}
        />
        <button
          className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => {
            changeUser(localUser);
          }}
        >
          ✔
        </button>
      </div>

      <table>
        <caption>Clients</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Surname</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.surname}</td>
              <td>{client.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={addClient}
        >
          Add client
        </button>
      </div>
    </div>
  );
}
