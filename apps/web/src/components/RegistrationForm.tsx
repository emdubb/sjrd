import { useState, type ChangeEvent } from 'react';
import {
  REGISTRATION_FORM_ACTION,
  FIELD_NAMES,
  EXPERIENCE_LEVELS,
  CLASS_OPTIONS,
  ACKNOWLEDGE_FEES_VALUE,
} from '../lib/registrationForm';

export default function RegistrationForm() {
  const [dob, setDob] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [dobYear, dobMonth, dobDay] = dob ? dob.split('-') : ['', '', ''];
  const [paymentYear, paymentMonth, paymentDay] = paymentDate
    ? paymentDate.split('-')
    : ['', '', ''];

  function handleIframeLoad() {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="confirmation">
        <h3>You&apos;re registered!</h3>
        <p>
          Thanks for signing up. Keep an eye on your email — we&apos;ll follow up to confirm your
          spot and provide next steps.
        </p>

        <style jsx>{`
          .confirmation {
            max-width: 640px;
            margin: 0 auto;
            text-align: center;
            background: #ffffff;
            border-radius: 20px;
            padding: 3rem 2rem;
            border: 1px solid rgba(11, 35, 63, 0.08);
            box-shadow: 0 10px 24px rgba(11, 35, 63, 0.1);
          }

          h3 {
            margin: 0 0 1rem;
            font-size: 1.75rem;
          }

          p {
            margin: 0;
            font-size: 1.1rem;
            line-height: 1.7;
            color: rgba(11, 35, 63, 0.85);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <form
        className="form"
        action={REGISTRATION_FORM_ACTION}
        method="POST"
        target="registration-frame"
      >
        <fieldset>
          <legend>Skater Information</legend>

          <div className="field">
            <label htmlFor="firstName">Skater&apos;s legal first name</label>
            <input id="firstName" name={FIELD_NAMES.firstName} type="text" required />
          </div>

          <div className="field">
            <label htmlFor="lastName">Skater&apos;s legal last name</label>
            <input id="lastName" name={FIELD_NAMES.lastName} type="text" required />
          </div>

          <div className="field">
            <label htmlFor="preferredName">Preferred name</label>
            <input id="preferredName" name={FIELD_NAMES.preferredName} type="text" />
          </div>

          <div className="field">
            <label htmlFor="pronouns">Skater&apos;s pronouns</label>
            <input id="pronouns" name={FIELD_NAMES.pronouns} type="text" />
          </div>

          <div className="field">
            <label htmlFor="dob">Date of birth</label>
            <input
              id="dob"
              type="date"
              required
              value={dob}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDob(event.target.value)}
            />
            <input type="hidden" name={FIELD_NAMES.dobYear} value={dobYear} />
            <input type="hidden" name={FIELD_NAMES.dobMonth} value={dobMonth} />
            <input type="hidden" name={FIELD_NAMES.dobDay} value={dobDay} />
          </div>

          <div className="field">
            <span className="group-label">Skater&apos;s experience level</span>
            <div className="options">
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level} className="option">
                  <input type="radio" name={FIELD_NAMES.experience} value={level} required />
                  {level}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact Information</legend>

          <div className="field">
            <label htmlFor="email">Your email</label>
            <input id="email" name={FIELD_NAMES.email} type="email" required />
          </div>

          <div className="field">
            <label htmlFor="phone">Your phone number</label>
            <input id="phone" name={FIELD_NAMES.phone} type="tel" required />
          </div>

          <div className="field">
            <label htmlFor="paypalEmail">PayPal email (if different than above)</label>
            <input id="paypalEmail" name={FIELD_NAMES.paypalEmail} type="email" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Class Registration</legend>

          <div className="field">
            <label htmlFor="classRegistration">Choose a session</label>
            <select
              id="classRegistration"
              name={FIELD_NAMES.classRegistration}
              required
              defaultValue={CLASS_OPTIONS[0]}
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Emergency Contact</legend>

          <div className="field">
            <label htmlFor="emergencyContactName">Emergency contact person</label>
            <input
              id="emergencyContactName"
              name={FIELD_NAMES.emergencyContactName}
              type="text"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="emergencyContactPhone">Emergency contact phone number</label>
            <input
              id="emergencyContactPhone"
              name={FIELD_NAMES.emergencyContactPhone}
              type="tel"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="relationship">Relationship to skater</label>
            <input
              id="relationship"
              name={FIELD_NAMES.relationshipToSkater}
              type="text"
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Almost Done</legend>

          <div className="field">
            <label htmlFor="heardAboutUs">How did you hear about Sacramento Roller Derby?</label>
            <input id="heardAboutUs" name={FIELD_NAMES.heardAboutUs} type="text" required />
          </div>

          <div className="field">
            <label htmlFor="paymentDate">Payment date</label>
            <input
              id="paymentDate"
              type="date"
              required
              value={paymentDate}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setPaymentDate(event.target.value)
              }
            />
            <input type="hidden" name={FIELD_NAMES.paymentYear} value={paymentYear} />
            <input type="hidden" name={FIELD_NAMES.paymentMonth} value={paymentMonth} />
            <input type="hidden" name={FIELD_NAMES.paymentDay} value={paymentDay} />
            <p className="hint">
              Prepayment is required to hold your spot. Pay via PayPal, then enter the date you
              paid above. If you need to pay with cash, email us directly.
            </p>
          </div>

          <div className="field">
            <label className="option checkbox">
              <input
                type="checkbox"
                name={FIELD_NAMES.acknowledgeFees}
                value={ACKNOWLEDGE_FEES_VALUE}
                required
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
              />
              I understand that registration fees are non-refundable, but may be moved to a
              future session if I can&apos;t attend this one.
            </label>
          </div>
        </fieldset>

        <button type="submit" className="submit">
          Submit Registration
        </button>
      </form>

      <iframe
        name="registration-frame"
        title="Registration submission"
        hidden
        onLoad={handleIframeLoad}
      />

      <style jsx>{`
        .form {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        fieldset {
          border: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        legend {
          padding: 0 0 1rem;
          font-family: var(--font-display), sans-serif;
          font-size: 1.3rem;
          color: #0b233f;
          border-bottom: 2px solid rgba(11, 35, 63, 0.1);
          width: 100%;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label,
        .group-label {
          font-size: 1rem;
          font-weight: 600;
          color: #0b233f;
        }

        input[type='text'],
        input[type='email'],
        input[type='tel'],
        input[type='date'],
        select {
          font: inherit;
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(11, 35, 63, 0.25);
          background: #ffffff;
          color: #0b233f;
        }

        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #f2bf35;
          outline-offset: 2px;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-height: 44px;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(11, 35, 63, 0.15);
          font-size: 1rem;
          font-weight: 400;
          cursor: pointer;
        }

        .option input {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .checkbox {
          align-items: flex-start;
          line-height: 1.5;
        }

        .hint {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(11, 35, 63, 0.65);
        }

        .submit {
          align-self: center;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.9rem 2.5rem;
          border-radius: 8px;
          border: 2px solid transparent;
          background: #f2bf35;
          color: #0b233f;
          box-shadow: 0 8px 18px rgba(242, 191, 53, 0.35);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .submit:hover {
          background: #ffcf5c;
          transform: translateY(-3px);
        }

        .submit:focus-visible {
          outline: 2px solid #0b233f;
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
}
