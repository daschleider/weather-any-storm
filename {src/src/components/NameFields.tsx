'use client';

interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
}

interface NameFieldsProps {
  attendees: Attendee[];
  onChange: (index: number, field: 'firstName' | 'lastName' | 'email', value: string) => void;
  errors?: boolean[];
  labelPrefix?: string;
  showIndex?: boolean;
  showEmail?: boolean;
}

export default function NameFields({
  attendees,
  onChange,
  errors = [],
  labelPrefix = 'Guest',
  showIndex = true,
  showEmail = true,
}: NameFieldsProps) {
  return (
    <div className="name-rows">
      {attendees.map((att, i) => (
        <div className="name-row-group" key={i}>
          {showIndex && attendees.length > 1 && (
            <span className="name-row-label">
              {labelPrefix} {i + 1}
            </span>
          )}
          <div className="name-row">
            <input
              className={`field-input${errors[i] ? ' error' : ''}`}
              type="text"
              placeholder="First Name"
              value={att.firstName}
              onChange={e => onChange(i, 'firstName', e.target.value)}
              autoComplete="given-name"
            />
            <input
              className={`field-input${errors[i] ? ' error' : ''}`}
              type="text"
              placeholder="Last Name"
              value={att.lastName}
              onChange={e => onChange(i, 'lastName', e.target.value)}
              autoComplete="family-name"
            />
          </div>
          {showEmail && (
            <input
              className={`field-input field-input-email${errors[i] ? ' error' : ''}`}
              type="email"
              placeholder="Email Address"
              value={att.email}
              onChange={e => onChange(i, 'email', e.target.value)}
              autoComplete="email"
            />
          )}
        </div>
      ))}
    </div>
  );
}
