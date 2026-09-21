import type { ReactNode } from "react";
import type { Student } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { PortalRoleSnapshot } from "@/lib/roles";
import { CopyButton } from "@/components/copy-button";
import { formatDate } from "@/lib/format";
import { displayableRoleLabels } from "@/lib/roles";

const STATUS_STYLE: Record<Student["status"], string> = {
  active: "text-success",
  suspended: "text-warning",
  withdrawn: "text-muted",
  expelled: "text-danger",
};

export function StudentIdView({
  student,
  signOut,
  locale,
  dictionary,
  roles,
}: {
  student: Pick<Student, "studentId" | "createdAt" | "status"> | null;
  signOut: ReactNode;
  locale: Locale;
  dictionary: Dictionary;
  roles: PortalRoleSnapshot;
}) {
  if (!student) {
    return (
      <div className="panel max-w-2xl space-y-6">
        <p className="text-sm font-medium text-warning">{dictionary.id.missingKicker}</p>
        <h1 className="page-heading">{dictionary.id.missingTitle}</h1>
        <p className="text-muted">{dictionary.id.missingBody}</p>
        {signOut}
      </div>
    );
  }

  const roleLabels = displayableRoleLabels(roles, locale);
  const displayedAcademyRoles = roleLabels.academy.length > 0 ? roleLabels.academy : [];

  return (
    <div className="max-w-2xl space-y-8 sm:space-y-10">
      <section className="space-y-6" aria-labelledby="student-id-heading">
        <div className="space-y-3">
          <h1 id="student-id-heading" className="page-heading">{dictionary.id.title}</h1>
          <p className="text-muted">{dictionary.id.description}</p>
        </div>
        <div className="panel student-number-panel space-y-5">
          <p className="student-number" aria-label={`${dictionary.id.title} ${student.studentId.split("").join(" ")}`}>
            {student.studentId}
          </p>
          <CopyButton
            value={student.studentId}
            label={dictionary.id.copy}
            pendingLabel={dictionary.id.copyPending}
            successMessage={dictionary.id.copyStatus}
            errorMessage={dictionary.id.copyFailure}
            workingMessage={dictionary.id.copyWorking}
          />
        </div>
      </section>

      <section className="panel space-y-4" aria-labelledby="student-info-heading">
        <h2 id="student-info-heading" className="section-heading">{dictionary.id.infoHeading}</h2>
        <dl className="divide-y divide-line">
          <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-muted">{dictionary.id.issuedAt}</dt>
            <dd>{formatDate(student.createdAt, locale)}</dd>
          </div>
          <div className="grid items-start gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="text-muted">{dictionary.id.status}</dt>
            <dd><span className={`status-badge ${STATUS_STYLE[student.status]}`}>{dictionary.status[student.status]}</span></dd>
          </div>
        </dl>
      </section>

      <section className="panel space-y-5" aria-labelledby="roles-heading">
        <h2 id="roles-heading" className="section-heading">{dictionary.roles.heading}</h2>
        {!roles.rolesAvailable ? (
          <div className="notice-panel" role="status">
            <p className="font-medium">{dictionary.roles.unavailable}</p>
            <p className="mt-1 text-sm text-muted">{dictionary.roles.unavailableAction}</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-base font-medium">{dictionary.roles.heading}</h3>
              {displayedAcademyRoles.length > 0 ? (
                <ul className="flex flex-wrap gap-2" aria-label={dictionary.roles.heading}>
                  {displayedAcademyRoles.map((label) => <li key={label} className="role-chip">{label}</li>)}
                </ul>
              ) : <p className="text-sm text-muted">{dictionary.roles.none}</p>}
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">{dictionary.roles.majorHeading}</h3>
              {roleLabels.majors.length > 0 ? (
                <ul className="flex flex-wrap gap-2" aria-label={dictionary.roles.majorHeading}>
                  {roleLabels.majors.map((label) => <li key={label} className="role-chip">{label}</li>)}
                </ul>
              ) : <p className="text-sm text-muted">{dictionary.roles.none}</p>}
            </div>
            {roles.majorCount > 5 && (
              <aside className="notice-panel warning-panel" aria-labelledby="major-warning-heading">
                <h3 id="major-warning-heading" className="font-semibold">{dictionary.roles.warningTitle}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{dictionary.roles.warningBody(roles.majorCount)}</p>
              </aside>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="handling-heading">
        <h2 id="handling-heading" className="text-base font-medium">{dictionary.id.handlingHeading}</h2>
        <p className="mt-2 text-sm leading-[1.75] text-muted">{dictionary.id.handlingBody}</p>
      </section>

      <div className="pt-2">{signOut}</div>
    </div>
  );
}
