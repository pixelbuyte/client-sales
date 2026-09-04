// A job ticket — a real person, a town, what they said. Stamped MISSED or
// BOOKED. Used in the hero (both faces) and the timeline.

export type TicketProps = {
  no: string;
  time: string;
  name: string;
  town: string;
  said: string;
  status: "missed" | "booked";
  stamp: string;
  stampNote: string;
  className?: string;
};

export function Ticket({ no, time, name, town, said, status, stamp, stampNote, className = "" }: TicketProps) {
  return (
    <article className={`c04-ticket c04-ticket--${status} ${className}`}>
      <div className="c04-ticket-meta">
        <span>#{no}</span>
        <span>{time}</span>
      </div>
      <div className="c04-ticket-name">
        {name} <span>· {town}</span>
      </div>
      <p className="c04-ticket-said">&ldquo;{said}&rdquo;</p>
      <div className="c04-stamp" aria-label={`${stamp}, ${stampNote}`}>
        {stamp}
        <small>{stampNote}</small>
      </div>
    </article>
  );
}
