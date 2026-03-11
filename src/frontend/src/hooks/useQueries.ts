import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CaseType, ConsultationStatus } from "../backend";
import { useActor } from "./useActor";

export { CaseType, ConsultationStatus };

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitConsultation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      caseType: CaseType;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitConsultationRequest(
        data.name,
        data.email,
        data.phone,
        data.caseType,
        data.description,
      );
    },
  });
}

export function useCheckStatus() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.checkRequestStatus(id);
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; status: ConsultationStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRequestStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allRequests"] });
    },
  });
}
