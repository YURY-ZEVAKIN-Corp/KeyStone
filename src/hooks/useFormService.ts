import { useCallback } from "react";
import { requireService } from "../services/ServiceRegistry";
import { FormButtonConfig } from "../types/form.types";
import type { FormServiceClass } from "../services/FormService";

/**
 * Hook for working with FormService from the service registry
 */
export const useFormService = () => {
  const getFormService = useCallback(() => {
    return requireService<FormServiceClass>("FormService");
  }, []);

  const openForm = useCallback(
    <TInput = any, TOutput = any>(
      formId: string,
      inputModel: TInput = {} as TInput,
      buttonConfig?: FormButtonConfig,
      formEntityId?: string,
    ): Promise<TOutput> => {
      const formService = getFormService();
      return formService.openForm<TInput, TOutput>(
        formId,
        inputModel,
        buttonConfig,
        formEntityId,
      );
    },
    [getFormService],
  );

  const openFormWithWaiting = useCallback(
    async <TInput = any, TOutput = any>(
      formId: string,
      inputModel: TInput = {} as TInput,
      asyncOperation?: () => Promise<TInput>,
      waitingMessage?: string,
      buttonConfig?: FormButtonConfig,
      formEntityId?: string,
    ): Promise<TOutput> => {
      const formService = getFormService();
      return formService.openFormWithWaiting<TInput, TOutput>(
        formId,
        inputModel,
        asyncOperation,
        waitingMessage,
        buttonConfig,
        formEntityId,
      );
    },
    [getFormService],
  );

  const resolveForm = useCallback(
    (outputModel: any) => {
      const formService = getFormService();
      formService.resolveForm(outputModel);
    },
    [getFormService],
  );

  const rejectForm = useCallback(
    (reason?: any) => {
      const formService = getFormService();
      formService.rejectForm(reason);
    },
    [getFormService],
  );

  const isFormOpen = useCallback(() => {
    const formService = getFormService();
    return formService.isFormOpen();
  }, [getFormService]);

  const getCurrentFormState = useCallback(() => {
    const formService = getFormService();
    return formService.getCurrentFormState();
  }, [getFormService]);

  return {
    openForm,
    openFormWithWaiting,
    resolveForm,
    rejectForm,
    isFormOpen,
    getCurrentFormState,
  };
};
