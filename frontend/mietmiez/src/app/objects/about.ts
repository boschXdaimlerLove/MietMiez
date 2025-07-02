export default class About {
  disclaimer: string;
  shortAbout: string;
  about: string;
  privacyNote: string;
  mail: string;
  copyright: string;
  license: string;

  constructor(
    disclaimer: string,
    shortAbout: string,
    about: string,
    privacyNote: string,
    mail: string,
    copyright: string,
    license: string,
  ) {
    this.disclaimer = disclaimer;
    this.shortAbout = shortAbout;
    this.about = about;
    this.privacyNote = privacyNote;
    this.mail = mail;
    this.copyright = copyright;
    this.license = license;
  }

  static fromJSON(json: AboutJson): About {
    if (
      typeof json !== "object" ||
      (json === null &&
        "disclaimer" in json &&
        "short-about" in json &&
        "about" in json &&
        "privacy-note" in json &&
        "mail" in json &&
        "copyright" in json &&
        "license" in json)
    ) {
      return new About(
        json["disclaimer"],
        json["short-about"],
        json["about"],
        json["privacy-note"],
        json["mail"],
        json["copyright"],
        json["license"],
      );
    }
    throw new Error("Ungültiges JSON-Objekt");
  }
}

interface AboutJson {
  disclaimer: string;
  about: string;
  "short-about": string;
  "privacy-note": string;
  mail: string;
  copyright: string;
  license: string;
}
