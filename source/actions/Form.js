// @flow

import {
  FORM_INITIALISATION,
  RESET_FORM,
  SET_FORM_SUBMITTING,
  UPDATE_FORM,
} from '../constants/Form';
import { getReduxConst } from '../utils/common';
import type { FieldsData } from '../types/Field';
import type { FormInitialisation, SetFormSubmitting, ResetForm, UpdateForm } from '../types/Form';

export const formInitialisation = (formName: string, fields: FieldsData): FormInitialisation => ({
  type: getReduxConst(FORM_INITIALISATION),
  formName,
  fields,
});

export const updateForm = (formName: string, fields: FieldsData): UpdateForm => ({
  type: getReduxConst(UPDATE_FORM),
  formName,
  fields,
});

export const setFormSubmitting = (formName: string, submitting: boolean): SetFormSubmitting => ({
  type: getReduxConst(SET_FORM_SUBMITTING),
  formName,
  submitting,
});

export const resetForm = (formName: string): ResetForm => ({
  type: getReduxConst(RESET_FORM),
  formName,
});
