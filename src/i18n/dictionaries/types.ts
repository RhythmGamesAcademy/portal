import type { Locale } from "@/i18n/config";

export type StudentStatus = "active" | "suspended" | "withdrawn" | "expelled";

export interface Dictionary {
  locale: Locale;
  metadata: {
    title: string;
    description: string;
    idTitle: string;
    joinTitle: string;
    errorTitle: string;
  };
  header: {
    academyName: string;
    portalName: string;
    skipToContent: string;
    relatedLinks: string;
    formsPortal: string;
    language: string;
    ja: string;
    en: string;
  };
  home: {
    title: string;
    description: string;
    loginHeading: string;
    loginDescription: string;
    firstLogin: string;
    laterLogin: string;
    privacy: string;
    signIn: string;
    signInPending: string;
  };
  id: {
    title: string;
    description: string;
    copy: string;
    copyPending: string;
    copyStatus: string;
    copyFailure: string;
    copyWorking: string;
    infoHeading: string;
    issuedAt: string;
    status: string;
    handlingHeading: string;
    handlingBody: string;
    missingKicker: string;
    missingTitle: string;
    missingBody: string;
    signOut: string;
    signOutPending: string;
  };
  status: Record<StudentStatus, string>;
  roles: {
    heading: string;
    majorHeading: string;
    none: string;
    unavailable: string;
    unavailableAction: string;
    warningTitle: string;
    warningBody: (count: number) => string;
    student: string;
    instructor: string;
    other: string;
  };
  join: {
    kicker: string;
    title: string;
    description: string;
    stepsHeading: string;
    stepJoin: string;
    stepReturn: string;
    invite: string;
    inviteMissing: string;
    back: string;
  };
  error: {
    kicker: string;
    title: string;
    fallback: string;
    accessDenied: string;
    configuration: string;
    verification: string;
    back: string;
  };
}
