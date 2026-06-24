import { splitAtORP } from '../utils/tokenizer.js';

export default function RSVPDisplay({ word, placeholder }) {
  if (!word) {
    return (
      <div className="rsvp-stage">
        <div className="rsvp-tick rsvp-tick-top" aria-hidden="true" />
        <div className="rsvp-word rsvp-word-placeholder">{placeholder}</div>
        <div className="rsvp-tick rsvp-tick-bottom" aria-hidden="true" />
      </div>
    );
  }

  const { prefix, pivot, suffix } = splitAtORP(word);

  return (
    <div className="rsvp-stage">
      <div className="rsvp-tick rsvp-tick-top" aria-hidden="true" />
      <div className="rsvp-word" aria-live="off">
        <span className="rsvp-prefix">{prefix}</span>
        <span className="rsvp-pivot">{pivot}</span>
        <span className="rsvp-suffix">{suffix}</span>
      </div>
      <div className="rsvp-tick rsvp-tick-bottom" aria-hidden="true" />
    </div>
  );
}
