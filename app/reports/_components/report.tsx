/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checklist } from "@prisma/client";

import "@/app/report.css";
import Head from "next/head";
import Script from "next/script";

export const Report = ({
  checklist,
}: {
  checklist: Checklist & { [key: string]: any };
}) => {
  const formatDate = (date?: string) => {
    // Implementação da formatação de data
    return new Date(date || "").toLocaleDateString();
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pagedjs/dist/paged.polyfill.min.js"
        async
      />
      <h1>CHECK-LIST MANUTENÇÃO PREDIAL</h1>
      <section className="card">
        <fieldset>
          <div className="line">
            <p>
              <span>ÓRGÃO:</span> {checklist.organization.name}
            </p>
            <p style={{ flex: 2 }}>
              <span>UNIDADE ADMINISTRATIVA:</span> {checklist.property.name}
            </p>
          </div>
          <div className="line">
            <p>
              <span>RESPONSÁVEL PELA UNIDADE:</span>{" "}
              {checklist.property.person.name}
            </p>
          </div>
          <div className="line">
            <p>
              <span>CARGO:</span> {checklist.property.person.role}
            </p>
            <p>
              <span>TEL.:</span> {checklist.property.person.phone}
            </p>
          </div>
        </fieldset>
      </section>

      <section className="card">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#22c55e"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0Zm-.091 15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696 1.393-1.437 2.793 2.707 5.809-5.701 1.404 1.425-5.793 5.707Z" />
                  </svg>
                  BOM
                </div>
              </th>
              <th>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#eab308"
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                  >
                    <path d="M256 512c141.385 0 256-114.615 256-256S397.385 0 256 0 0 114.615 0 256C0.153 397.322 114.678 511.847 256 512zM234.667 128c0-11.782 9.551-21.333 21.333-21.333s21.333 9.551 21.333 21.333v170.667c0 11.782-9.551 21.333-21.333 21.333s-21.333-9.551-21.333-21.333V128zM256 384c11.782 0 21.333 9.551 21.333 21.333s-9.551 21.333-21.333 21.333-21.333-9.551-21.333-21.333S244.218 384 256 384z" />
                  </svg>
                  REGULAR
                </div>
              </th>
              <th>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ef4444"
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                  >
                    <path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256C511.847 114.678 397.322 0.153 256 0zM341.333 311.189c8.669 7.979 9.229 21.475 1.25 30.144-7.979 8.669-21.475 9.229-30.144 1.25L256 286.165l-55.168 55.168c-8.475 8.185-21.98 7.95-30.165-0.525-7.984-8.267-7.984-21.373 0-29.64L225.835 256l-55.168-55.168c-8.185-8.475-7.95-21.98 0.525-30.165 8.267-7.984 21.373-7.984 29.64 0L256 225.835l55.189-55.168c7.979-8.669 21.475-9.229 30.144-1.25 8.669 7.979 9.229 21.475 1.25 30.144L286.165 256l55.168 55.189z" />
                  </svg>
                  RUIM
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {checklist.checklistItems.map((item: any, index: number) => (
              <tr key={index}>
                <td className="item">{item.item.name}</td>
                <td>
                  <input
                    disabled
                    type="radio"
                    value="bom"
                    checked={item.score === 3}
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="radio"
                    value="regular"
                    checked={item.score === 2}
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="radio"
                    value="ruim"
                    checked={item.score === 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <fieldset>
          <div className="line">
            <p>
              <span>RESPONSÁVEL PELA FISCALIZAÇÃO:</span> {checklist.user.name}
            </p>
          </div>
          <div className="line">
            <p style={{ flex: 2 }}>
              <span>CARGO:</span> GESTÃO DE PATRIMÔNIO
            </p>
            <p>
              <span>DATA:</span> {formatDate(checklist.finished_at?.toString())}
            </p>
            <p style={{ fontFamily: "monospace" }}>
              <span style={{ fontFamily: "'Geist', sans-serif" }}>
                ASSINATURA:
              </span>{" "}
              {checklist.finished_at ? "DIGITAL" : ""}
            </p>
          </div>
        </fieldset>
      </section>

      <section style={{ height: "100%" }}>
        <h1>IMAGENS</h1>
        {checklist.checklistItems.map((item: any, index: number) => (
          <div key={index} className="card card-images">
            <fieldset>
              <div className="line">
                <p>
                  <span>ITEM:</span> {item.item.name}
                </p>
                <p>
                  <span>PONTUAÇÃO:</span>{" "}
                  {item.score === 3
                    ? "BOM"
                    : item.score === 2
                      ? "REGULAR"
                      : "RUIM"}
                </p>
              </div>
              <div className="line">
                <p style={{ wordBreak: "break-word" }}>
                  <span>OBSERVAÇÃO:</span> {item.observation}
                </p>
              </div>
            </fieldset>
            <div className="images-grid">
              {item.images.map((image: any, imgIndex: number) => (
                <figure key={imgIndex}>
                  <img
                    src={`${process.env.BUCKET_URL}${image.image}`}
                    alt="Minha Figura"
                  />
                  <figcaption>{image.observation}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};
