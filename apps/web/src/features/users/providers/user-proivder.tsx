import { useParams } from "react-router-dom";
import { createProvider } from "../../../utils/create-provider";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../utils/api/api";

export const [
  /**Provides functionality for the UserScreen.*/
  UserProvider,
  /**Accesses the functionality provided by a UserProvider. */
  useUserContext,
] = createProvider({
  contextName: "UserContext",
  hook: ({ id }: { id: string }) => {
    const { data: user, isPending } = useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const res = await api.users.get(id);
        return res.success ? res.data : null;
      },
    });

    return {
      user,
      isPending,
    };
  },
});
