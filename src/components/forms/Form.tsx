import React from 'react';
import { Formik } from 'formik';

interface AppFormProps {
  initialValues: Object;
  onSubmit(values: Object): void;
  validationSchema: Object;
  children: any;
}

function AppForm({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}: AppFormProps) {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
