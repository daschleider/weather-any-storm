'use client';

interface Attendee {
  firstName: string;
  lastName: string;
}

interface NameFieldsProps {
  attendees: Attendee[];
  onChange: (index: number, field: 'firstName' | 'lastName', value: string) => void;
  errors?: boolean[];
  labelPrefix?: string;
  showIndex?: boolean;
}

export default function NameFields({
  attendees,
  onChange,
  errors = [],
  labelPrefix = 'Guest',
  showIndex = true,
}: NameFieldsProps) {
  return (
    <div className="name-rows">
      {attendees.map((att, i) => (
        <div className="name-row" key={i}>
          {showIndex && attendees.length > 1 && (
            <span className="name-row-label">
              {labelPrefix} {i + 1}
            </span>
          )}
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
      ))}
    </div>
  );
}
