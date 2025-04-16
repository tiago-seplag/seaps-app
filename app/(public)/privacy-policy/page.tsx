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
        Esta Política de Privacidade apresenta as diretrizes de{" "}
        <strong>
          coleta, uso, armazenamento, tratamento e proteção de dados pessoais
        </strong>{" "}
        dos usuários do aplicativo{" "}
        <strong>Sistema de Manutenção Predial</strong>, uma solução do Governo
        do Estado de Mato Grosso voltada à gestão, fiscalização e acompanhamento
        das condições dos patrimônios públicos estaduais. <br />O aplicativo
        está em conformidade com a{" "}
        <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong> e demais
        legislações correlatas (ver item 5) e faz uso da autenticação unificada
        MT Login, respeitando os princípios da{" "}
        <strong>
          transparência, segurança e uso responsável dos dados públicos.
        </strong>
      </TypographyP>
      <TypographyH3>2. Descrição do Produto</TypographyH3>
      <TypographyP>
        O <strong>Sistema de Manutenção Predial</strong> é uma ferramenta
        digital destinada a agentes públicos responsáveis por realizar{" "}
        <strong>vistorias e checklists técnicos</strong> em estruturas prediais
        do Estado. O aplicativo permite:
      </TypographyP>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Avaliar itens e estruturas com base em critérios técnicos (Bom,
          Regular, Ruim);
        </li>
        <li>
          Anexar imagens como evidência fotográfica das condições encontradas;
        </li>
        <li>Gerar relatórios automáticos e padronizados de vistoria;</li>
        <li>Manter um histórico contínuo de avaliações prediais.</li>
      </ul>
      <TypographyP>
        A solução está disponível para dispositivos móveis e web, é integrada às
        plataformas do Governo do Estado por meio do sistema de login unificado
        MT Login.
      </TypographyP>
      <TypographyH3>3. Dados Pessoais Coletados</TypographyH3>
      <div>
        Por meio do MT Login, os seguintes dados pessoais poderão ser coletados
        e utilizados:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Nome completo;</li>
          <li>CPF;</li>
          <li>Data de nascimento;</li>
          <li>Nome da mãe;</li>
          <li>E-mail;</li>
          <li>Número de telefone (opcional);</li>
          <li>Endereço (opcional);</li>
          <li>Dados de autenticação (login e senha);</li>
          <li>
            Informações de acesso como IP, horário, dispositivo utilizado e
            geolocalização.
          </li>
        </ul>
        <p>Além disso, durante o uso do aplicativo, podem ser coletados:</p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>
              Imagens capturadas com a câmera ou selecionadas da galeria
            </strong>
            ;
          </li>
          <li>
            Dados de geolocalização associados à imagem (caso autorizado);
          </li>
          <li>
            Informações funcionais do servidor público que realiza o checklist;
          </li>
          <li>Resultados das vistorias e avaliações realizadas.</li>
        </ul>
      </div>
      <TypographyH3>4. Finalidade da Coleta</TypographyH3>A coleta e o
      tratamento dos dados têm as seguintes finalidades:
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <strong>Identificar o usuário de forma segura e unificada</strong>{" "}
          (via MT Login);
        </li>
        <li>
          <strong>Garantir rastreabilidade das vistorias</strong> realizadas por
          agentes públicos;
        </li>
        <li>
          <strong>Documentar com evidência fotográfica</strong> as condições dos
          patrimônios;
        </li>
        <li>
          <strong>Gerar relatórios técnicos</strong> de manutenção e
          conservação;
        </li>
        <li>
          <strong>Aprimorar a gestão predial pública</strong>, com base em dados
          objetivos e atualizados.
        </li>
      </ul>
      <TypographyH3>5. Base Legal e Legislação Aplicável</TypographyH3>
      <div>
        A presente política está fundamentada nas seguintes normas:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>Lei nº 13.709/2018</strong> -{" "}
            <em>Lei Geral de Proteção de Dados Pessoais (LGPD)</em>;
          </li>
          <li>
            <strong>Lei nº 12.965/2014</strong> -{" "}
            <em>Marco Civil da Internet</em>, que define os princípios e
            garantias para uso da internet;
          </li>
          <li>
            <strong>Lei nº 12.527/2011</strong> -{" "}
            <em>Lei de Acesso à Informação (LAI)</em>;
          </li>
          <li>
            <strong>Lei nº 13.460/2017</strong> -{" "}
            <em>Direitos do Usuário dos Serviços Públicos</em>;
          </li>
          <li>
            <strong>Decreto Estadual nº 951/2021</strong> -{" "}
            <em>Sistema de Governança Digital do Programa Mais MT</em>;
          </li>
          <li>
            <strong>Decreto Estadual nº 546/2023</strong> -{" "}
            <em>Identificação digital e assinatura eletrônica</em>;
          </li>
          <li>
            <strong>Decreto Estadual nº 806/2021</strong> -{" "}
            <em>Proteção de dados pessoais e identidade dos denunciantes</em>;
          </li>
          <li>
            <strong>Decreto Estadual nº 338/2023</strong> -{" "}
            <em>Estratégia Digital do Estado</em>;
          </li>
          <li>
            <strong>Resolução nº 002/2021/NGD</strong> -{" "}
            <em>Canais e tecnologias da Plataforma de Governo Digital</em>;
          </li>
          <li>
            <strong>Regulamento (UE) nº 2016/679</strong> -{" "}
            <em>
              Regulamento Geral sobre a Proteção de Dados da União Europeia
              (GDPR)
            </em>
            , em caráter complementar à LGPD.
          </li>
        </ul>
        O uso do app implica aceite desta política.
      </div>
      <TypographyH3>6. Compartilhamento e Armazenamento</TypographyH3>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          Os dados coletados serão{" "}
          <strong>
            armazenados em infraestrutura tecnológica gerenciada pela MTI
          </strong>
          , garantindo integridade e segurança.
        </li>
        <li>
          O <strong>uso compartilhado de dados</strong> poderá ocorrer{" "}
          <strong>entre órgãos públicos</strong>, exclusivamente para o
          cumprimento de suas finalidades institucionais e legais.
        </li>
        <li>
          Não será feito{" "}
          <strong>compartilhamento com terceiros privados</strong>, salvo por
          determinação judicial ou autorização expressa do titular.
        </li>
      </ul>
      <TypographyH3>7. Segurança e Boas Práticas</TypographyH3>
      <div>
        A Administração Pública Estadual adota medidas para:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Proteger os dados contra acesso não autorizado;</li>
          <li>Evitar vazamentos, perdas ou alterações indevidas;</li>
          <li>
            Garantir que as permissões de acesso à câmera e à galeria sejam
            solicitadas de forma transparente e utilizadas apenas com a
            finalidade prevista.
          </li>
        </ul>
      </div>
      <TypographyH3>8. Direitos do Usuário</TypographyH3>
      <div>
        O titular dos dados poderá:
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Consultar os dados armazenados sobre si;</li>
          <li>Corrigir informações incorretas;</li>
          <li>
            Solicitar a exclusão de registros fotográficos ou pessoais, quando
            aplicável;
          </li>
          <li>
            Revogar permissões de câmera, galeria ou localização via
            configurações do dispositivo.
          </li>
        </ul>
      </div>
      <TypographyH3>9. Comunicação e Suporte</TypographyH3>
      <div>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>MTI</strong>:{" "}
            <code>centraldeatendimento@mti.mt.gov.br</code> | Tel.: (65)
            3613-3003{" "}
          </li>
          <li>
            <strong>Ouvidoria Geral do Estado</strong>:{" "}
            <ul className="my-2 ml-6 list-decimal [&>li]:mt-2">
              <li>
                Site:{" "}
                <a href="https://www.cge.mt.gov.br/ouvidoria">
                  www.cge.mt.gov.br/ouvidoria
                </a>{" "}
              </li>
              <li>
                E-mail: <code>ouvidoria@cge.mt.gov.br</code>{" "}
              </li>
              <li>Telefones: 162 ou 0800 647 1520</li>
            </ul>
          </li>
        </ul>
      </div>
      <TypographyH3>10. Consentimento</TypographyH3>
      <TypographyP>
        O uso do aplicativo implica na{" "}
        <strong>leitura, compreensão e aceitação integral</strong> desta
        Política de Privacidade, incluindo o consentimento para coleta,
        tratamento e armazenamento de dados conforme aqui descrito.
      </TypographyP>
      <TypographyH3>11. Exclusão de Dados</TypographyH3>
      <div>
        <TypographyP>
          O titular dos dados pessoais poderá, a qualquer momento,{" "}
          <strong>
            solicitar a exclusão parcial ou total de seus dados pessoais
          </strong>{" "}
          armazenados, incluindo imagens, informações de login, registros de
          vistoria e quaisquer outros dados coletados no âmbito da utilização do
          aplicativo <strong>Sistema de Manutenção Predial</strong>. <br />A
          solicitação de exclusão deverá ser realizada por meio dos canais
          oficiais de atendimento, sendo eles:
        </TypographyP>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <p>
              <strong>Central de Atendimento da MTI</strong>
              <br />
              E-mail: <code>centraldeatendimento@mti.mt.gov.br</code>
              <br />
              Telefone: (65) 3613-3003
            </p>
          </li>
          <li>
            <p>
              <strong>Ouvidoria Geral do Estado de Mato Grosso</strong>
              <br />
              Site:{" "}
              <a href="https://www.cge.mt.gov.br/ouvidoria">
                www.cge.mt.gov.br/ouvidoria
              </a>
              <br />
              E-mail: <code>ouvidoria@cge.mt.gov.br</code>
              <br />
              Telefones: 162 (ligação local) ou 0800 647 1520 (gratuito)
            </p>
          </li>
        </ul>
        <TypographyP>
          A exclusão será realizada no prazo razoável, respeitando as{" "}
          <strong>obrigações legais e administrativas aplicáveis</strong>,
          especialmente nos casos em que os dados estejam vinculados a processos
          administrativos, obrigações legais, auditorias ou controle interno da
          Administração Pública.
        </TypographyP>
        <TypographyP>
          A exclusão poderá não ser possível nos seguintes casos:
        </TypographyP>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Quando os dados estiverem{" "}
            <strong>
              necessariamente vinculados ao exercício de função pública ou
              cumprimento de obrigação legal ou regulatória
            </strong>{" "}
            por parte da Administração Pública;
          </li>
          <li>
            Quando os dados forem necessários para fins de{" "}
            <strong>resguardo do interesse público</strong>, segurança,
            integridade de sistemas ou prevenção de fraudes.
          </li>
        </ul>
      </div>
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
