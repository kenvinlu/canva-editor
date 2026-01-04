"use client";

import { useFormik } from "formik";
import QRCode from "react-qr-code";
import { useTranslations } from "next-intl";
import * as yup from 'yup';
import { saveTotpSecret } from "../services/auth.service";
import { useState } from "react";
import { BaseResponseModel } from "../models/base.model";

export default function TwoFactorAppSetup({
  secret,
  url,
  onComplete
}: {
  secret: string;
  url: string;
  onComplete: (response: BaseResponseModel<{ success: boolean }>) => void;
}) {
const t = useTranslations();
const [errorMessage, setErrorMessage] = useState('');
const handleFormSubmit = async (values: {
  secret: string;
  code: string;
}) => {
  try {
    const response = await saveTotpSecret(values.secret, values.code);
    onComplete(response);
  } catch (error) {
    setErrorMessage(t('auth.messages.twoFactorFailed'));
  }
};
const formik = useFormik({
    initialValues: {
      secret,
      code: '',
    },
    validationSchema: yup.object().shape({
      secret: yup
        .string()
        .required(t('auth.messages.emailRequired')),
      code: yup.string().required(t('auth.messages.passwordRequired')),
    }),
    onSubmit: handleFormSubmit,
  });
  return (
    <>
      <div className="">
        <div
          className="flex flex-col items-center px-6 py-8 mt-8 
            mx-auto lg:py-0 w-fit"
        >
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-2 md:space-y-3 sm:p-8">
              <h3 className="text-xl font-semibold pb-4">
                {t('auth.setupAuthenticatorApp')}
              </h3>

              <p>
                {t('auth.setupAuthenticatorAppNote')}
              </p>

              <p className="py-2">
                {t('auth.secretKey')}: <strong>{secret}</strong>
              </p>
              <div
                style={{
                  height: "auto",
                  margin: "0 auto",
                  maxWidth: 150,
                  width: "100%",
                }}
              >
                {url && (
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={url}
                  viewBox={`0 0 256 256`}
                />
                )}
              </div>

              <div className="pt-4">
                <p className="mb-2">
                  {t('auth.enterTheSixDigitCodeFromYourAuthenticatorAppNote')}
                </p>
              </div>

              <div>
                <p className="mb-3">
                  {t('auth.verifyCodeFromApp')}
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <input type="hidden" name="secret" value={formik.values.secret} />

                  <div>
                    <input
                      type="text"
                      name="code"
                      autoComplete="off"
                      className="bg-gray-50 border border-gray-300 
                        text-gray-900 rounded-lg focus:ring-gray-600 
                        focus:border-gray-600 block p-2"
                      placeholder={t('auth.sixDigitCode')}
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {errorMessage && (
                    <div className="py-2 text-red-500 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2 text-center"
                    >
                      {t('common.continue')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}