import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createSignal, getFilterStatus} from "../apis/apiEndpoints";
import {CreateSignalPayload} from "../types/signal";
import {message} from "antd";
import {addSignalInCache} from "../utils/signal";

const useCreateSignal = () => {
	const queryClient = useQueryClient();
	const {
		mutateAsync: createUserSignal,
		isPending: signalPending,
		isError: signalError,
		data: signalData,
	} = useMutation({
		mutationFn: (payload: CreateSignalPayload) => createSignal(payload),
		onSuccess: (data) => {
			message.success("Signal created successfully");
			if (data) {
				addSignalInCache(data.data, queryClient);
			}
		},
		onError: (error) => {
			message.success(error.message);
			console.log("The signal error =====>", error);
		},
	});
	return {
		createUserSignal,
		signalPending,
		signalError,
		signalData,
	};
};

export default useCreateSignal;
