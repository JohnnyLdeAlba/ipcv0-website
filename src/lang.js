class t_hash {

  key;
  value;

  constructor(key, value) {

    this.key = key;
    this.value = value;
  }
}

class t_lang {

  captions;
  messages;

  constructor() {

    this.captions = [];
    this.messages = [];
  }

  setCaption(key, value) {

    const item = new t_hash(key, value);
    this.captions.push(item);
  }

  setMessage(key, value) {

    const item = new t_hash(key, value);
    this.messages.push(item);
  }

  getCaption(key) {

    let index = 0;
    while(index < this.captions.length) {

      if (this.captions[index].key == key)
        return this.captions[index].value;

      index++;
    }

    return "";
  }

  getMessage(key) {

    let index = 0;
    while(index < this.messages.length) {

      if (this.messages[index].key == key)
        return this.messages[index].value;

      index++;
    }

    return "";
  }
}

export function createEngLang() {

  const eng_lang = new t_lang();

  eng_lang.setCaption("NOT_CONNECTED", "Wallet Not Connected");
  eng_lang.setCaption("APPROVALFORALL_NOT_OWNER", "Unable To Set Approval For All");
  eng_lang.setCaption("APPROVALFORALL_PENDING", "Approval For All Pending");
  eng_lang.setCaption("APPROVALFORALL_OK", "Approval For All Updated");
  eng_lang.setCaption("TOKEN_NOT_APPROVED", "Token Has Not Been Approved");
  eng_lang.setCaption("MUST_BE_APPROVED", "Unable To Approve Token");
  eng_lang.setCaption("APPROVAL_PENDING", "Approval Pending");
  eng_lang.setCaption("APPROVAL_OK", "Approval Successful");
  eng_lang.setCaption("TOKEN_LIMIT_REACHED", "Unable To Wrap Token");
  eng_lang.setCaption("TOKEN_ALREADY_WRAPPED", "Unable To Wrap Token");
  eng_lang.setCaption("WRAPPED_NOT_OWNER", "Unable To Wrap Token");
  eng_lang.setCaption("WRAP_PENDING", "Wrap Pending");
  eng_lang.setCaption("WRAP_OK", "Wrap Successful");
  eng_lang.setCaption("UNWRAPPED_NOT_OWNER", "Unable To Wrap Token");
  eng_lang.setCaption("TOKEN_NOT_WRAPPED", "Unable To Unwrap Token");
  eng_lang.setCaption("TOKEN_STOLEN", "Unable To Wrap Token.");
  eng_lang.setCaption("UNWRAP_PENDING", "Unwrap Pending");
  eng_lang.setCaption("UNWRAP_OK", "Unwrap Successful");
  eng_lang.setCaption("WRAPALL_FAILED", "Wrap All Failed");
  eng_lang.setCaption("WRAPALL_PENDING", "Wrap All Pending");
  eng_lang.setCaption("WRAPALL_OK", "Wrap All Successful");
  eng_lang.setCaption("UNWRAPALL_FAILED", "Unwrap All Failed");
  eng_lang.setCaption("UNWRAPALL_PENDING", "Unwrap All Pending");
  eng_lang.setCaption("UNWRAPALL_OK", "Unwrap All Successful");
  eng_lang.setCaption("NAMECHANGE_DISABLED", "Unable To Change IPC's Name");
  eng_lang.setCaption("NAMECHANGE_NOT_OWNER", "Unable To Change IPC's Name");
  eng_lang.setCaption("VAULT_TRANSFER_FAILED", "Transfer Failed");

  eng_lang.setMessage("NOT_CONNECTED", "Wallet must be connected to interact with tokens.");
  eng_lang.setMessage("APPROVALFORALL_NOT_OWNER", "The connected wallet does not have authorization.");
  eng_lang.setMessage("APPROVALFORALL_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("APPROVALFORALL_OK", "Approval for all has been successfully updated.");
  eng_lang.setMessage("TOKEN_NOT_APPROVED", "Token must be approved by owner before it can be wrapped.");
  eng_lang.setMessage("MUST_BE_APPROVED", "The connected wallet does not own token.");
  eng_lang.setMessage("APPROVAL_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("APPROVAL_OK", "Token has successfully been approved.");
  eng_lang.setMessage("TOKEN_LIMIT_REACHED", "The token limit has been reached.");
  eng_lang.setMessage("TOKEN_ALREADY_WRAPPED", "The selected token has already been wrapped.");
  eng_lang.setMessage("WRAPPED_NOT_OWNER", "The connected wallet does not own token.");
  eng_lang.setMessage("WRAP_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("WRAP_OK", "Token has successfully been wrapped.");
  eng_lang.setMessage("UNWRAPPED_NOT_OWNER", "The connected wallet does not own token.");
  eng_lang.setMessage("TOKEN_NOT_WRAPPED", "The selected token is not wrapped.");
  eng_lang.setMessage("TOKEN_STOLEN", "The selected token may have been stolen.");
  eng_lang.setMessage("UNWRAP_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("UNWRAP_OK", "Token has successfully been unwrapped.");
  eng_lang.setMessage("WRAPALL_FAILED", "Failed to wrap all tokens. Be sure to enable \"Approve All Tokens\".");
  eng_lang.setMessage("WRAPALL_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("WRAPALL_OK", "All tokens have successfully wrapped.");
  eng_lang.setMessage("UNWRAPALL_FAILED", "Failed to unwrap all tokens.");
  eng_lang.setMessage("UNWRAPALL_PENDING", "Tap to view this transaction in Etherscan.");
  eng_lang.setMessage("UNWRAPALL_OK", "All tokens have successfully unwrapped.");
  eng_lang.setMessage("NAMECHANGE_DISABLED", "Marketplace has been disabled.");
  eng_lang.setMessage("NAMECHANGE_NOT_OWNER", "The connected wallet does not own token.");
  eng_lang.setMessage("VAULT_TRANSFER_FAILED", "Vault transfer failed.");

  return eng_lang;
}
