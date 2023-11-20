import Cleave from 'cleave.js/react';
import './helpers/cleave/phone-type-formatter.ar-br';
import { forwardRef } from 'react';

const CleavePhoneNumberTextField = forwardRef((props: any, ref: any) => {
  const { value, onChange, className, country, cleaveKey } = props;
  const { code, prefix } = country;

  return (
    <Cleave
      key={cleaveKey}
      htmlRef={(inputNode: HTMLInputElement) => (inputNode = ref)}
      value={value}
      onChange={onChange}
      className={className}
      options={{ phone: true, phoneRegionCode: code || 'AR', prefix }}
    />
  );
});

export default CleavePhoneNumberTextField;
