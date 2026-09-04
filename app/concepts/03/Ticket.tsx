import { Tick } from "./Illustrations";

export type TicketState = "missed" | "booked";

export type TicketData = {
  no: string;
  at: string;
  name: string;
  town: string;
  said: string;
  /** What happened once recovery was on. */
  booked: string;
  /** Stamp word for the recovered state (Booked / Replied / On call). */
  stamp?: string;
  /** Worked-example job value, if it goes ahead. */
  value?: number;
  kind?: "call" | "estimate";
};

type Props = {
  t: TicketData;
  /** Which stamp reads as "current" for server-rendered / no-JS visitors. */
  state: TicketState;
  tape?: "corners" | "top" | "none";
  className?: string;
  showValue?: boolean;
};

/**
 * A paper job ticket: perforated left edge, torn bottom, tape at the corners,
 * and a slot on the right where the rubber stamp lands. Both stamps are in
 * the DOM; data-state decides which one shows before JS takes over.
 */
export function Ticket({ t, state, tape = "corners", className = "", showValue = false }: Props) {
  const on = state === "booked";
  return (
    <article className={`c03-ticket c03-ticket-stamped ${className}`} data-ticket data-state={state}>
      {tape === "corners" ? (
        <>
          <span className="c03-tape c03-tape-tl" aria-hidden="true" />
          <span className="c03-tape c03-tape-tr" aria-hidden="true" />
        </>
      ) : null}
      {tape === "top" ? <span className="c03-tape c03-tape-top" aria-hidden="true" /> : null}

      <div className="c03-ticket-head">
        <strong>#{t.no}</strong>
        <span>{t.at}</span>
        {t.kind === "estimate" ? <span>· estimate</span> : null}
      </div>
      <div className="c03-ticket-name">
        {t.name} <span>· {t.town}</span>
      </div>
      <p className="c03-ticket-said">
        <em>&ldquo;{t.said}&rdquo;</em>
      </p>
      <div className="c03-ticket-foot" data-foot>
        {on ? (
          <>
            <Tick size={15} />
            <span>{t.booked}</span>
          </>
        ) : (
          <span>No answer. They called the next shop.</span>
        )}
      </div>
      {showValue && t.value ? (
        <div className="c03-ticket-value">
          <b>${t.value.toLocaleString("en-US")}</b>
          <span>job value if it goes ahead — example</span>
        </div>
      ) : null}

      <div className="c03-stamp-slot" aria-hidden="true">
        <span
          className="c03-stamp c03-stamp-missed"
          data-stamp="missed"
          style={{ opacity: on ? 0 : 1 }}
        >
          Missed
          <small>no answer</small>
        </span>
        <span
          className="c03-stamp c03-stamp-booked"
          data-stamp="booked"
          style={{ opacity: on ? 1 : 0 }}
        >
          {t.stamp ?? "Booked"}
          <small>{t.kind === "estimate" ? "answered" : "on the board"}</small>
        </span>
      </div>
      <span className="c03-sr">{on ? `Status: ${t.stamp ?? "booked"}` : "Status: missed"}</span>
    </article>
  );
}
