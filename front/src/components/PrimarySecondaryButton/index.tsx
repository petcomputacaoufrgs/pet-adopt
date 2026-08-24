import { PrimaryButton, SecondaryButton } from "./styles";

import type {IButton} from "./types"

const PrimarySecondaryButton = ({ width, buttonType = "Primário", isDisabled = false, highlighted = false, content, onClick, type = 'button', height, $flex=false, paddingV, paddingH, fontSize}: IButton) => {
    return ( 
      <>

        {(buttonType === "Primário") ? (
          <PrimaryButton type={type} $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH} $fontSize={fontSize}>{content}</PrimaryButton>
        ) : (
          <SecondaryButton type={type} $width={width} onClick={onClick} disabled={isDisabled} $highlighted={highlighted} $height={height} $flex={$flex} $paddingV={paddingV} $paddingH={paddingH} $fontSize={fontSize}>{content}</SecondaryButton>
        )}
        
      </>
    )
  };

  export default PrimarySecondaryButton;
