import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export const useRecordings = () => {
  return useQuery({
    queryKey: ["recordings"],
    queryFn: async () => {
      const res = await axiosInstance.get("/recordings");
      return res.data;
    },
  });
};

export const useRecordingById = (id) => {
  return useQuery({
    queryKey: ["recording", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/recordings/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
