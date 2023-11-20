// formik components
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import CustomTextField from 'src/@core/components/mui/text-field';
import { DynamicComponentTypes, IDynamicFormComponent } from 'src/types/dynamics';
import { lazy } from 'react';

// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

// ** React Imports
import { useState } from 'react';

// ** Third Party Imports
import { EditorState, convertFromHTML, convertToRaw, ContentState } from 'draft-js';

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg';
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface PropsType {
  component: IDynamicFormComponent;
  isCreating?: boolean;
}

const DynamicFormComponentInputEditor = ({ component, isCreating, ...rest }: PropsType) => {
  const { values, setFieldValue, errors, touched, handleBlur } = useFormikContext();

  const theValues = values as any;
  const theErrors = errors as any;
  const theTouched = touched as any;

  const sampleMarkup = `<!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <!--[if mso]>
      <xml><o:officedocumentsettings><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml>
      <![endif]-->
      <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
            rel="stylesheet" media="screen">
      <style>
          .hover-underline:hover {
              text-decoration: underline !important;
          }

          @media (max-width: 600px) {
              .sm-w-full {
                  width: 100% !important;
              }

              .sm-px-24 {
                  padding-left: 24px !important;
                  padding-right: 24px !important;
              }

              .sm-py-32 {
                  padding-top: 32px !important;
                  padding-bottom: 32px !important;
              }
          }
      </style>
  </head>
  <body style="margin: 0; width: 100%; padding: 0; word-break: break-word; -webkit-font-smoothing: antialiased;">
  <div style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; display: none;">Aconcagua Finance | Cripto ingresada</div>
  <div role="article" aria-roledescription="email" aria-label="" lang="en"
       style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly;">
      <table style="width: 100%; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;" cellpadding="0"
             cellspacing="0" role="presentation">
          <tr>
              <td align="center"
                  style="mso-line-height-rule: exactly; background-color: #eceff1; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
                  <table class="sm-w-full" style="width: 600px;" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                          <td class="sm-py-32 sm-px-24"
                              style="mso-line-height-rule: exactly; padding: 48px; text-align: center; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
                              <a href="https://www.aconcagua.finance"
                                 style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly;">
                                  <img src="images/logo.png" width="155" alt="Aconcagua Finance"
                                       style="max-width: 100%; vertical-align: middle; line-height: 100%; border: 0;">
                              </a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" class="sm-px-24"
                              style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly;">
                              <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                      <td class="sm-px-24"
                                          style="mso-line-height-rule: exactly; border-radius: 4px; background-color: #ffffff; padding: 48px; text-align: left; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 16px; line-height: 24px; color: #626262;">
                                          <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin-bottom: 0; font-size: 20px; font-weight: 600;">¡Hola</p>
                                          <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin-top: 0; font-size: 24px; font-weight: 700; color: #3db1bd;">{{username}}!</p>
                                          <p class="sm-leading-32"
                                             style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 24px; font-size: 24px; font-weight: 600; color: #263238;">Ingresó cripto a la bóveda 💰</p>
                                          <table style="width: 100%;" cellpadding="0" cellspacing="0"
                                                 role="presentation">
                                              <tr>
                                                  <td style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; font-size: 16px;"><strong>Bóveda #</strong> <br>{{vaultId}}</td>
                                              </tr>
                                              <tr>
                                                  <td style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; font-size: 16px;">
                                                      <br>
                                                      <strong>Acreedor</strong> <br> {{lender}}
                                                  </td>
                                              </tr>
                                          </table>
                                          <table align="left"
                                                 style="margin-left: auto; margin-right: auto; width: 100%; text-align: center;"
                                                 cellpadding="0" cellspacing="0" role="presentation">
                                              <tr>
                                                  <td align="left"
                                                      style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly;">
                                                      <table style="margin-top: 24px; margin-bottom: 24px;"
                                                             cellpadding="0" cellspacing="0" role="presentation">
                                                          <tr>
                                                              <td
                                                                  style="mso-line-height-rule: exactly; mso-padding-alt: 16px 24px; border-radius: 4px; background-color: #3db1bd; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
                                                                  <a href="https://aconcagua.app"
                                                                     style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; display: block; padding-left: 24px; padding-right: 24px; padding-top: 16px; padding-bottom: 16px; font-size: 16px; font-weight: 600; line-height: 100%; color: #ffffff; text-decoration: none;">Ir a Aconcagua
                                                                      &rarr;</a>
                                                              </td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; padding-top: 32px; padding-bottom: 32px;">
                                                      <div style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; height: 1px; background-color: #eceff1; line-height: 1px;">&zwnj;</div>
                                                  </td>
                                              </tr>
                                          </table>
                                          <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 16px;">¿Necesitás ayuda? Escribinos a <a href="mailto:hola@aconcagua.finance" class="hover-underline" style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; color: #3db1bd; text-decoration: none;">hola@aconcagua.finance</a></p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; height: 20px;"></td>
                      </tr>
                      <tr>
                          <td style="mso-line-height-rule: exactly; padding-left: 48px; padding-right: 48px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; color: #eceff1;">
                              <p align="center" style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; margin-bottom: 16px; cursor: default;">
                                  <a href="https://www.aconcagua.finance"
                                     style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; color: #263238; text-decoration: none;">
                                      <img src="images/icono_aconcagua.png" width="17" alt="Aconcagua Finance"
                                           style="max-width: 100%; vertical-align: middle; line-height: 100%; border: 0; margin-right: 12px;">
                                  </a>
                              </p>
                              <p style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; color: #626262;">
                                  Nuestro servicio está sujeto a nuestros <a href="https://aconcagua.app/policy" class="hover-underline" style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; color: #3db1bd; text-decoration: none;">Términos y Condiciones</a>
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td style="font-family: 'Montserrat', sans-serif; mso-line-height-rule: exactly; height: 16px;"></td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </div>
  </body>
  </html>
  `;

  // const blocksFromHTML = convertFromHTML(sampleMarkup);
  const blocksFromHTML = convertFromHTML(theValues && theValues[component.name] ? theValues[component.name] : '');

  const initialState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState, setEditorState] = useState(EditorState.createWithContent(initialState));

  const formComponent = component as IDynamicFormComponent;
  const isError = theErrors && theErrors[component.name] && theTouched && theTouched[component.name];

  if (!values) return null;

  return (
    <EditorWrapper
      sx={{
        '& .rdw-editor-wrapper .rdw-editor-main': { px: 5 },
        '& .rdw-editor-wrapper, & .rdw-option-wrapper': { border: 0 },
      }}
    >
      <ReactDraftWysiwyg
        editorState={editorState}
        onEditorStateChange={(data) => {
          setEditorState(data);

          const content = editorState.getCurrentContent();
          console.log(convertToRaw(content));

          // setFieldValue(component.name,  ,true)
        }}
      />
    </EditorWrapper>
  );
};

export default DynamicFormComponentInputEditor;
