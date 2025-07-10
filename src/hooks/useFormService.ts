import { useCallback } from "react";
import { FormService } from "../services/FormService";
import { FormButtonConfig } from "../types/form.types";

/**
 * Hook for working with FormService
 */
export const useFormService = () => {
  const openForm = useCallback(
    <TInput = any, TOutput = any>(
      formId: string,
      inputModel: TInput = {} as TInput,
      buttonConfig?: FormButtonConfig,
    ): Promise<TOutput> => {
      return FormService.openForm<TInput, TOutput>(
        formId,
        inputModel,
        buttonConfig,
      );
    },
    [],
  );

  const isFormOpen = useCallback(() => {
    return FormService.isFormOpen();
  }, []);

  const getCurrentFormState = useCallback(() => {
    return FormService.getCurrentFormState();
  }, []);

  return {
    openForm,
    isFormOpen,
    getCurrentFormState,
  };
};
