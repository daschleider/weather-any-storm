'use client';

import { useState, useCallback } from 'react';
import NameFields from './NameFields';

interface RSVPPanelProps {
  isOpen: boolean;
  onBack: () => void;
  onSubmit: (status: 'attending' | 'cant_make_it') => void;
}

interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
}

const EMPTY_ATTENDEE: Attendee = { firstName: '', lastName: '', email: '' };

export default function RSVPPanel({ isOpen, onBack, onSubmit }: RSVPPanelProps) {
  const [count, setCount] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [cantMakeIt, setCantMakeIt] = useState(false);
  const [declineName, setDeclineName] = useState<Attendee>(EMPTY_ATTENDEE);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [nameErrors, setNameErrors] = useState<boolean[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const increment = () => {
    setCount(c => c + 1);
    setAttendees(prev => [...prev, { ...EMPTY_ATTENDEE }]);
  };

  const decrement = () => {
    if (count <= 0) return;
    setCount(c => c - 1);
    setAttendees(prev => prev.slice(0, -1));
  };

  const handleCantMakeIt = (checked: boolean) => {
    setCantMakeIt(checked);
    if (checked) {
      setCount(0);
      setAttendees([]);
      setNameErrors([]);
    }
  };

  const updateAttendee = useCallback(
    (index: number, field: 'firstName' | 'lastName' | 'email', value: string) => {
      setAttendees(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };
        return copy;
      });
    },
    []
  );

  const validate = (): boolean => {
    const errs: Record<string, boolean> = {};
    const nErrs: boolean[] = [];
    let valid = true;

    if (!cantMakeIt) {
      if (count < 1) {
        errs.count = true;
        valid = false;
      } else {
        attendees.forEach((a, i) => {
          if (!a.firstName.trim() || !a.lastName.trim()) {
            nErrs[i] = true;
            valid = false;
          }
        });
      }
    } else {
      if (!declineName.firstName.trim() || !declineName.lastName.trim()) {
        errs.declineName = true;
        valid = false;
      }
    }

    setErrors(errs);
    setNameErrors(nErrs);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);

    // Build attendee data as structured pairs for the sheet
    const attendeeData = cantMakeIt
      ? []
      : attendees.map((a, i) => ({
          name: `${a.firstName} ${a.lastName}`,
          email: a.email,
        }));

    const payload = {
      status: cantMakeIt ? 'cant_make_it' : 'attending',
      attendeeCount: cantMakeIt ? 0 : count,
      // Readable string: "First Last (email), First Last (email)"
      attendeeNames: attendeeData
        .map(a => a.email ? `${a.name} (${a.email})` : a.name)
        .join(', '),
      // Individual columns for sheet: attendee1Name, attendee1Email, attendee2Name, etc.
      attendees: attendeeData,
      declineFirstName: cantMakeIt ? declineName.firstName : '',
      declineLastName: cantMakeIt ? declineName.lastName : '',
      declineEmail: cantMakeIt ? declineName.email : '',
    };

    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      console.error('Failed to save RSVP.');
    }

    setIsSubmitting(false);
    onSubmit(cantMakeIt ? 'cant_make_it' : 'attending');
  };

  const attendingActive = count > 0 && !cantMakeIt;

  return (
    <div className={`rsvp-panel${isOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="RSVP Form">
      <div className="rsvp-panel-inner">

        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <span className="back-arrow">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path d="M6 13V1M1 5.5L6 1L11 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Back
        </button>

        <h2 className="rsvp-header helvetica-bold">RSVP</h2>
        <div className="rsvp-divider" aria-hidden="true" />

        <div className="rsvp-form">

          {/* Row 1: Attending */}
          <div className={`rsvp-row${cantMakeIt ? ' disabled' : ''}`}>
            <span className="rsvp-row-label helvetica-regular">Attending</span>
            <div className="rsvp-row-control">
              <div className="counter" role="group" aria-label="Number of attendees">
                <button className="counter-btn" onClick={decrement} disabled={count <= 0 || cantMakeIt} aria-label="Decrease">−</button>
                <input className="counter-input" type="number" value={count} readOnly aria-label="Attendee count" />
                <button className="counter-btn" onClick={increment} disabled={cantMakeIt} aria-label="Increase">+</button>
              </div>

              {errors.count && !cantMakeIt && (
                <p className="error-msg">Please add at least one attendee.</p>
              )}

              {attendees.length > 0 && !cantMakeIt && (
                <>
                  <NameFields
                    attendees={attendees}
                    onChange={updateAttendee}
                    errors={nameErrors}
                    showIndex={attendees.length > 1}
                    showEmail={true}
                  />
                  {nameErrors.some(Boolean) && (
                    <p className="error-msg">Please fill in all name fields.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Row 2: Can't Make It — softdisabled when attending active */}
          <div className={`rsvp-row${attendingActive ? ' softdisabled' : ''}`}>
            <span className="rsvp-row-label helvetica-regular">Can't Make It</span>
            <div className="rsvp-row-control">
              <div className="cant-make-it-control">
                <label className="custom-checkbox" htmlFor="cant-make-it">
                  <input
                    id="cant-make-it"
                    type="checkbox"
                    checked={cantMakeIt}
                    onChange={e => handleCantMakeIt(e.target.checked)}
                  />
                  <span className="checkmark" />
                </label>
              </div>

              {cantMakeIt && (
                <>
                  <NameFields
                    attendees={[declineName]}
                    onChange={(_, field, value) =>
                      setDeclineName(prev => ({ ...prev, [field]: value }))
                    }
                    errors={errors.declineName ? [true] : []}
                    showIndex={false}
                    showEmail={true}
                  />
                  {errors.declineName && (
                    <p className="error-msg">Please enter your name.</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="continue-section">
            <button className="continue-btn" onClick={handleSubmit} disabled={isSubmitting} aria-busy={isSubmitting}>
              <span>{isSubmitting ? 'Sending…' : 'Continue'}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
