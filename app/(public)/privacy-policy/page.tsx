/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModeToggle } from "@/components/mode-toggle";

export default function Page() {
  return (
    <div className="container mx-auto px-8 py-6">
      <h2 className="rounded bg-primary py-4 text-center text-3xl font-bold text-white">
        Política de Privacidade - Aplicativo de Checklist de Manutenção Predial
      </h2>

      <TypographyH3>1. Informações Gerais</TypographyH3>
      <TypographyP>
        Esta Política de Privacidade contém informações sobre a coleta, uso,
        armazenamento, tratamento e proteção de dados pessoais dos usuários do
        aplicativo <strong>Sistema de Manutenção Predial</strong>, desenvolvido
        pelo Governo do Estado de Mato Grosso. O objetivo é garantir
        transparência e segurança no uso da câmera, galeria e imagens capturadas
        ou selecionadas pelo aplicativo.
      </TypographyP>

      <TypographyH3>2. Definições</TypographyH3>
      <TypographyP>
        São adotadas as definições previstas na Política de Privacidade da
        plataforma MT Login, como:
      </TypographyP>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <strong>Dado pessoal:</strong> informação relacionada à pessoa natural
          identificada ou identificável;
        </li>
        <li>
          <strong>Titular:</strong> pessoa natural a quem se referem os dados;
        </li>
        <li>
          <strong>Tratamento:</strong> operações como coleta, uso, arquivamento
          e eliminação de dados;
        </li>
        <li>
          <strong>Controlador:</strong> órgão público responsável pelas decisões
          sobre os dados;
        </li>
        <li>
          <strong>Operador:</strong> entidade que realiza o tratamento em nome
          do controlador.
        </li>
      </ul>

      <TypographyH3>3. Coleta e Tratamento de Imagens</TypographyH3>
      <div>
        O aplicativo acessa a câmera e a galeria do dispositivo para:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Capturar fotos de itens avaliados;</li>
          <li>Permitir seleção de imagens da galeria;</li>
          <li>Registrar visualmente as condições dos bens públicos.</li>
        </ul>
        As imagens são armazenadas em servidores públicos e associadas ao
        patrimônio avaliado.
      </div>

      <TypographyH3>4. Base Legal e Consentimento</TypographyH3>
      <div>
        <TypographyP>
          O tratamento dos dados pessoais e imagens no aplicativo se baseia nas
          seguintes normas:
        </TypographyP>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>Lei nº 13.709/2018</strong> - Lei Geral de Proteção de Dados
            Pessoais (LGPD);
          </li>
          <li>
            <strong>Lei nº 12.965/2014</strong> - Marco Civil da Internet, que
            estabelece princípios e garantias para o uso da internet no Brasil;
          </li>
          <li>
            <strong>Lei nº 12.527/2011</strong> - Lei de Acesso à Informação
            (LAI);
          </li>
          <li>
            <strong>Lei nº 13.460/2017</strong> - Dispõe sobre a participação,
            proteção e defesa dos direitos do usuário dos serviços públicos;
          </li>
          <li>
            <strong>Decreto Estadual nº 951/2021</strong> - Institui o Sistema
            de Governança Digital no âmbito do Programa Mais MT;
          </li>
          <li>
            <strong>Decreto Estadual nº 546/2023</strong> - Dispõe sobre
            identificação digital, assinatura eletrônica e procuração digital no
            Executivo Estadual;
          </li>
          <li>
            <strong>Decreto Estadual nº 806/2021</strong> - Regula a proteção de
            dados pessoais e salvaguardas à identidade dos denunciantes;
          </li>
          <li>
            <strong>Decreto Estadual nº 338/2023</strong> - Estabelece
            diretrizes da Estratégia Digital do Estado de MT;
          </li>
          <li>
            <strong>Resolução nº 002/2021/NGD</strong> - Define canais e
            tecnologias da Plataforma de Governo Digital;
          </li>
          <li>
            <strong>Regulamento (UE) nº 2016/679</strong> - Regulamento Geral de
            Proteção de Dados (GDPR) da União Europeia, aplicado como
            referência.
          </li>
        </ul>
        O uso do app implica aceite desta política.
      </div>

      <TypographyH3>5. Compartilhamento e Segurança</TypographyH3>
      <div>
        Os dados:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Não serão compartilhados com terceiros, salvo por obrigação legal;
          </li>
          <li>
            Serão protegidos pela SEPLAG e MTI com medidas técnicas adequadas.
          </li>
        </ul>
      </div>

      <TypographyH3>6. Responsabilidades</TypographyH3>
      <TypographyP>
        <strong>Usuário:</strong> responsável pela veracidade dos dados e pelo
        uso correto do app.
        <br />
        <strong>Administração Pública:</strong> garante proteção e uso legal dos
        dados.
      </TypographyP>

      <TypographyH3>7. Direitos do Usuário</TypographyH3>
      <div>
        O usuário pode:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Revogar permissões a qualquer momento (nas configurações do
            dispositivo);
          </li>
          <li>
            Entrar em contato com os canais oficiais para mais informações.
          </li>
        </ul>
      </div>

      <TypographyH3>8. Comunicação</TypographyH3>
      <div>
        <strong>MTI:</strong> centraldeatendimento@mti.mt.gov.br | (65)
        3613-3003
        <br />
        <strong>Ouvidoria:</strong>{" "}
        <a href="https://www.cge.mt.gov.br/ouvidoria" target="_blank">
          www.cge.mt.gov.br/ouvidoria
        </a>{" "}
        | ouvidoria@cge.mt.gov.br | 162 ou 0800 647 1520
      </div>

      <TypographyH3>9. Foro</TypographyH3>
      <TypographyP>
        Disputas judiciais serão tratadas na Comarca de Cuiabá/MT.
      </TypographyP>
      <TypographyP>
        Ao utilizar este aplicativo, você declara ter lido e aceitado
        integralmente esta Política de Privacidade.
      </TypographyP>
      <div className="fixed bottom-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}

function TypographyH3({ children }: any) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight [&:not(:first-child)]:mt-6">
      {children}
    </h3>
  );
}

function TypographyP({ children }: any) {
  return <p className="leading-7">{children}</p>;
}
