
/* ==========================================
   CASA DOS DENTES — JAVASCRIPT PRINCIPAL
   HTML + CSS + JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* 1. MENU PARA TELEMÓVEIS */

    const botaoMenu = document.querySelector("#botao-menu");
    const menuPrincipal = document.querySelector("#menu-principal");

    function fecharMenu() {
        if (!botaoMenu || !menuPrincipal) return;

        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        menuPrincipal.classList.remove("aberto");
        
/* CARROSSÉIS AUTOMÁTICOS DOS SERVIÇOS */

const carrosseisServicos = document.querySelectorAll(
    "[data-carrossel-servico]"
);

carrosseisServicos.forEach(function (carrossel) {
    const imagens = Array.from(
        carrossel.querySelectorAll(
            ".imagem-carrossel-servico"
        )
    );

    if (imagens.length <= 1) return;

    let indice = imagens.findIndex(function (imagem) {
        return imagem.classList.contains("ativa");
    });

    if (indice < 0) indice = 0;

    function mostrarImagem(novoIndice) {
        imagens.forEach(function (imagem, i) {
            const ativa = i === novoIndice;

            imagem.classList.toggle("ativa", ativa);
            imagem.setAttribute("aria-hidden", String(!ativa));
        });

        indice = novoIndice;
    }

    mostrarImagem(indice);

    const intervalo = window.setInterval(function () {
        if (document.hidden) return;

        mostrarImagem((indice + 1) % imagens.length);
    }, 2000);

    // Evita manter temporizadores depois de remover o carrossel.
    carrossel.dataset.intervaloIniciado = "true";
});

    }

    if (botaoMenu && menuPrincipal) {

        botaoMenu.addEventListener("click", function () {

            const menuAberto =
                botaoMenu.getAttribute("aria-expanded") === "true";

            botaoMenu.setAttribute(
                "aria-expanded",
                String(!menuAberto)
            );

            botaoMenu.setAttribute(
                "aria-label",
                menuAberto ? "Abrir menu" : "Fechar menu"
            );

            menuPrincipal.classList.toggle("aberto", !menuAberto);
        });

        menuPrincipal.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", fecharMenu);
        });

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") {
                fecharMenu();
            }
        });

        document.addEventListener("click", function (evento) {

            if (
                menuPrincipal.classList.contains("aberto") &&
                !menuPrincipal.contains(evento.target) &&
                !botaoMenu.contains(evento.target)
            ) {
                fecharMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                fecharMenu();
            }
        });
    }


   

/* ==========================================
   2. CARROSSEL PRINCIPAL
   Mudança automática a cada 2 segundos
========================================== */

const slides = Array.from(
    document.querySelectorAll(".hero-slide")
);

const botaoAnterior = document.querySelector("#hero-anterior");
const botaoSeguinte = document.querySelector("#hero-seguinte");
const indicadores = document.querySelector("#hero-indicadores");
const botaoPausa = document.querySelector("#hero-pausa");

let indiceAtual = 0;
let intervaloCarrossel = null;
let carrosselPausado = false;

const prefereMovimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

function atualizarCarrossel() {
    if (slides.length === 0) return;

    slides.forEach(function (slide, indice) {
        const ativo = indice === indiceAtual;

        slide.classList.toggle("ativo", ativo);
        slide.setAttribute("aria-hidden", String(!ativo));

        slide.querySelectorAll("a, button").forEach(function (elemento) {
            elemento.setAttribute("tabindex", ativo ? "0" : "-1");
        });
    });

    if (indicadores) {
        indicadores.querySelectorAll(".hero-indicador").forEach(
            function (botao, indice) {
                const ativo = indice === indiceAtual;

                botao.classList.toggle("ativo", ativo);

                if (ativo) {
                    botao.setAttribute("aria-current", "true");
                } else {
                    botao.removeAttribute("aria-current");
                }
            }
        );
    }
}

function criarIndicadores() {
    if (!indicadores) return;

    indicadores.replaceChildren();

    slides.forEach(function (_, indice) {
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "hero-indicador";
        botao.setAttribute(
            "aria-label",
            "Mostrar imagem " + (indice + 1)
        );

        botao.addEventListener("click", function () {
            indiceAtual = indice;
            atualizarCarrossel();
            atualizarRotacao();
        });

        indicadores.appendChild(botao);
    });
}

function mostrarSlide(indice) {
    if (slides.length <= 1) return;

    indiceAtual = (indice + slides.length) % slides.length;
    atualizarCarrossel();
}

function seguinteSlide() {
    mostrarSlide(indiceAtual + 1);
}

function anteriorSlide() {
    mostrarSlide(indiceAtual - 1);
}

function pararRotacao() {
    if (intervaloCarrossel !== null) {
        clearInterval(intervaloCarrossel);
        intervaloCarrossel = null;
    }
}

function atualizarBotaoPausa() {
    if (!botaoPausa) return;

    botaoPausa.textContent = carrosselPausado
        ? "Retomar apresentação"
        : "Pausar apresentação";

    botaoPausa.setAttribute(
        "aria-pressed",
        String(carrosselPausado)
    );
}

function atualizarRotacao() {
    pararRotacao();

    const devePausar =
        carrosselPausado ||
        document.hidden ||
        prefereMovimentoReduzido.matches ||
        slides.length <= 1;

    if (!devePausar) {
        intervaloCarrossel = setInterval(function () {
            seguinteSlide();
        }, 2000);
    }

    atualizarBotaoPausa();
}

if (slides.length > 0) {
    criarIndicadores();
    atualizarCarrossel();

    if (botaoAnterior) {
        botaoAnterior.addEventListener("click", function () {
            anteriorSlide();
            atualizarRotacao();
        });
    }

    if (botaoSeguinte) {
        botaoSeguinte.addEventListener("click", function () {
            seguinteSlide();
            atualizarRotacao();
        });
    }

    if (botaoPausa) {
        botaoPausa.addEventListener("click", function () {
            carrosselPausado = !carrosselPausado;
            atualizarRotacao();
        });
    }

    document.addEventListener(
        "visibilitychange",
        atualizarRotacao
    );

    if (prefereMovimentoReduzido.addEventListener) {
        prefereMovimentoReduzido.addEventListener(
            "change",
            atualizarRotacao
        );
    } else if (prefereMovimentoReduzido.addListener) {
        prefereMovimentoReduzido.addListener(
            atualizarRotacao
        );
    }

    atualizarRotacao();
}



    /* 3. PERGUNTAS FREQUENTES */

    const botoesPerguntas = document.querySelectorAll(
        ".pergunta-botao"
    );

    botoesPerguntas.forEach(function (botao) {

        const resposta = botao.nextElementSibling;

        if (
            !resposta ||
            !resposta.classList.contains("resposta-pergunta")
        ) {
            return;
        }

        // Todas as respostas começam fechadas.
        botao.setAttribute("aria-expanded", "false");
        resposta.hidden = true;

        botao.addEventListener("click", function () {

            const estaAberta =
                botao.getAttribute("aria-expanded") === "true";

            // Fecha as outras perguntas.
            botoesPerguntas.forEach(function (outroBotao) {

                const outraResposta = outroBotao.nextElementSibling;

                if (
                    outraResposta &&
                    outraResposta.classList.contains("resposta-pergunta")
                ) {
                    outroBotao.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    outraResposta.hidden = true;
                }
            });

            // Abre a pergunta selecionada, se estava fechada.
            if (!estaAberta) {
                botao.setAttribute("aria-expanded", "true");
                resposta.hidden = false;
            }
        });
    });


    /* 4. ANIMAÇÕES DE ENTRADA SEGURAS */

    const elementosAnimados = document.querySelectorAll(".animar");

    if (
        elementosAnimados.length > 0 &&
        "IntersectionObserver" in window &&
        !prefereMovimentoReduzido.matches
    ) {

        try {

            const observador = new IntersectionObserver(
                function (entradas, observadorAtual) {

                    entradas.forEach(function (entrada) {

                        if (entrada.isIntersecting) {
                            entrada.target.classList.add("visivel");
                            observadorAtual.unobserve(entrada.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -30px 0px"
                }
            );

            elementosAnimados.forEach(function (elemento) {
                observador.observe(elemento);
            });

            // Ativa as regras de animação apenas após configurar
            // corretamente o observador.
            document.body.classList.add("animacoes-ativas");

        } catch (erro) {

            // Em caso de erro, o conteúdo permanece visível.
            elementosAnimados.forEach(function (elemento) {
                elemento.classList.add("visivel");
            });

            document.body.classList.remove("animacoes-ativas");
        }

    } else {

        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add("visivel");
        });

        document.body.classList.remove("animacoes-ativas");
    }


    /* 5. DATA MÍNIMA PARA MARCAÇÃO */

    const campoData = document.querySelector("#data");

    function obterDataLocal() {

        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, "0");
        const dia = String(agora.getDate()).padStart(2, "0");

        return ano + "-" + mes + "-" + dia;
    }

    if (campoData) {

        campoData.min = obterDataLocal();

        campoData.addEventListener("change", function () {

            if (
                campoData.value &&
                campoData.value < obterDataLocal()
            ) {
                campoData.setCustomValidity(
                    "Selecione hoje ou uma data futura."
                );
            } else {
                campoData.setCustomValidity("");
            }
        });
    }


    /* 6. CONFIGURAÇÃO DO WHATSAPP */

    /*
       Substitua pelo número oficial da clínica,
       com o indicativo de Angola e sem o sinal +.

       Exemplo de formato:
       2449XXXXXXXX

       Enquanto o número não estiver configurado,
       o formulário não poderá abrir a conversa correta.
    */

    const telefoneClinica = "244XXXXXXXXX";

    const botaoWhatsApp = document.querySelector(
        "#whatsapp-flutuante"
    );

    const mensagemFormulario = document.querySelector(
        "#mensagem-formulario"
    );

    function numeroWhatsAppConfigurado() {
        return (
            /^\d{9,15}$/.test(telefoneClinica) &&
            !telefoneClinica.includes("X")
        );
    }

    if (botaoWhatsApp && numeroWhatsAppConfigurado()) {

        botaoWhatsApp.href =
            "https://wa.me/" + telefoneClinica;

        botaoWhatsApp.target = "_blank";
        botaoWhatsApp.rel = "noopener noreferrer";

        botaoWhatsApp.setAttribute(
            "aria-label",
            "Falar com a Casa dos Dentes pelo WhatsApp"
        );

        botaoWhatsApp.title = "Falar pelo WhatsApp";

    } else if (botaoWhatsApp) {

        botaoWhatsApp.href = "#contactos";
        botaoWhatsApp.removeAttribute("target");

        botaoWhatsApp.title =
            "Consulte os contactos da clínica";
    }


    /* 7. FORMULÁRIO DE MARCAÇÃO */

    const formulario = document.querySelector(
        "#formulario-marcacao"
    );

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            if (mensagemFormulario) {
                mensagemFormulario.textContent = "";
            }

            if (campoData) {

                campoData.setCustomValidity("");

                if (
                    campoData.value &&
                    campoData.value < obterDataLocal()
                ) {
                    campoData.setCustomValidity(
                        "Selecione hoje ou uma data futura."
                    );
                }
            }

            if (!formulario.checkValidity()) {
                formulario.reportValidity();
                return;
            }

            if (!numeroWhatsAppConfigurado()) {

                if (mensagemFormulario) {
                    mensagemFormulario.textContent =
                        "O formulário está preparado, mas é necessário " +
                        "configurar o número oficial do WhatsApp da clínica.";
                }

                return;
            }

            const dados = new FormData(formulario);

            const nome = String(
                dados.get("nome") || ""
            ).trim();

            const telefone = String(
                dados.get("telefone") || ""
            ).trim();

            const servico = String(
                dados.get("servico") || ""
            ).trim();

            const data = String(
                dados.get("data") || ""
            ).trim();

            const mensagem = String(
                dados.get("mensagem") || ""
            ).trim();

            if (!nome || !telefone || !servico || !data) {

                if (mensagemFormulario) {
                    mensagemFormulario.textContent =
                        "Preencha todos os campos obrigatórios.";
                }

                return;
            }

            const texto =
                "Olá, Casa dos Dentes! Gostaria de solicitar " +
                "uma marcação de consulta.\n\n" +
                "Nome: " + nome + "\n" +
                "Telefone: " + telefone + "\n" +
                "Serviço: " + servico + "\n" +
                "Data pretendida: " + data + "\n" +
                "Mensagem: " +
                (mensagem || "Sem mensagem adicional");

            const url =
                "https://wa.me/" +
                telefoneClinica +
                "?text=" +
                encodeURIComponent(texto);

            if (mensagemFormulario) {
                mensagemFormulario.textContent =
                    "A abrir o WhatsApp para continuar o pedido...";
            }

            const novaJanela = window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

            if (!novaJanela && mensagemFormulario) {
                mensagemFormulario.textContent =
                    "Não foi possível abrir uma nova janela. " +
                    "Permita a abertura de janelas para este site " +
                    "e tente novamente.";
            }
        });
    }


    /* 8. ANO AUTOMÁTICO NO RODAPÉ */

    const anoAtual = document.querySelector("#ano-atual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }
    const dadosServicos = {

        avaliacao: {
            titulo: "Avaliação dentária",
            introducao:
                "A avaliação dentária permite examinar os dentes e as gengivas, " +
                "identificar alterações e determinar quais os cuidados necessários. " +
                "Conheça alguns problemas que podem justificar uma consulta.",

            detalhes: [
                {
                    etiqueta: "Problema dentário",
                    titulo: "Cáries dentárias",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados dentários",
                    descricao:
                        "A cárie é uma lesão que pode danificar os tecidos do dente. " +
                        "No início, pode não provocar dor.",
                    solucao:
                        "O tratamento depende da extensão da lesão. " +
                        "Pode incluir aplicação de flúor em situações indicadas, " +
                        "restauração ou outros procedimentos."
                },
                {
                    etiqueta: "Dente danificado",
                    titulo: "Dente partido ou fraturado",
                    imagem:
                        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados de saúde oral",
                    descricao:
                        "Uma fratura pode ocorrer após um traumatismo, " +
                        "ao mastigar algo duro ou devido ao enfraquecimento do dente.",
                    solucao:
                        "Após o exame, o profissional poderá considerar " +
                        "uma restauração, coroa ou outro tratamento adequado."
                },
                {
                    etiqueta: "Perda dentária",
                    titulo: "Falta de um dente da frente",
                    imagem:
                        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de consulta dentária",
                    descricao:
                        "A perda de um dente anterior pode afetar o sorriso, " +
                        "a fala e, em alguns casos, a mastigação.",
                    solucao:
                        "Depois de avaliar a gengiva, o osso e os dentes vizinhos, " +
                        "o profissional poderá considerar opções como implante, " +
                        "ponte ou prótese removível."
                },
                {
                    etiqueta: "Sinais de alerta",
                    titulo: "Dor e sensibilidade dentária",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados dentários",
                    descricao:
                        "A dor ao mastigar, a sensibilidade ao frio ou ao quente " +
                        "e o desconforto persistente podem ter diferentes causas.",
                    solucao:
                        "A avaliação profissional ajuda a identificar a origem " +
                        "do problema. Dor intensa, inchaço ou febre justificam " +
                        "assistência rápida."
                }
            ]
        },

        higiene: {
            titulo: "Higiene oral",
            introducao:
                "A higiene oral diária ajuda a controlar a placa bacteriana " +
                "e a reduzir o risco de cáries e problemas nas gengivas.",

            detalhes: [
                {
                    etiqueta: "Prevenção",
                    titulo: "Placa bacteriana",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de higiene dentária",
                    descricao:
                        "A placa bacteriana é uma película que se acumula " +
                        "nos dentes e pode contribuir para o aparecimento de cáries.",
                    solucao:
                        "Escove os dentes duas vezes por dia com pasta com flúor " +
                        "e limpe os espaços entre os dentes diariamente."
                },
                {
                    etiqueta: "Saúde das gengivas",
                    titulo: "Gengivas inflamadas",
                    imagem:
                        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados de saúde oral",
                    descricao:
                        "Vermelhidão ou sangramento das gengivas podem indicar " +
                        "inflamação e não devem ser ignorados.",
                    solucao:
                        "Mantenha uma higiene suave e procure avaliação dentária " +
                        "para identificar a causa do sangramento."
                },
                {
                    etiqueta: "Cuidados diários",
                    titulo: "Técnica de escovagem",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados dentários",
                    descricao:
                        "Uma escovagem apressada ou com força excessiva " +
                        "pode dificultar a limpeza e irritar as gengivas.",
                    solucao:
                        "Escove durante cerca de dois minutos, com movimentos " +
                        "suaves, e peça orientação sobre a técnica adequada."
                },
                {
                    etiqueta: "Limpeza profissional",
                    titulo: "Tártaro acumulado",
                    imagem:
                        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de consulta dentária",
                    descricao:
                        "Quando a placa endurece, forma tártaro, que não pode " +
                        "ser removido completamente pela escovagem em casa.",
                    solucao:
                        "O profissional poderá recomendar uma limpeza dentária, " +
                        "conforme as necessidades de cada paciente."
                }
            ]
        },

        ortodontia: {
            titulo: "Ortodontia",
            introducao:
                "A ortodontia procura corrigir o alinhamento dos dentes " +
                "e determinadas alterações na mordida, de acordo com " +
                "a avaliação e o plano de tratamento individual.",

            detalhes: [
                {
                    etiqueta: "Alinhamento",
                    titulo: "Dentes desalinhados",
                    imagem:
                        "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de aparelho ortodôntico",
                    descricao:
                        "Dentes sobrepostos ou desalinhados podem dificultar " +
                        "a limpeza e afetar a harmonia do sorriso.",
                    solucao:
                        "Aparelhos fixos ou alinhadores podem ser opções " +
                        "em determinados casos, após avaliação profissional."
                },
                {
                    etiqueta: "Mordida",
                    titulo: "Alterações na mordida",
                    imagem:
                        "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de tratamento ortodôntico",
                    descricao:
                        "Algumas pessoas apresentam dificuldades no encaixe " +
                        "dos dentes superiores e inferiores.",
                    solucao:
                        "O ortodontista avalia a posição dos dentes e dos maxilares " +
                        "para determinar se é necessário tratamento."
                },
                {
                    etiqueta: "Acompanhamento",
                    titulo: "Cuidados durante o tratamento",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados dentários",
                    descricao:
                        "A utilização de aparelhos exige atenção especial " +
                        "à higiene oral e às consultas de acompanhamento.",
                    solucao:
                        "Siga as recomendações do profissional, mantenha " +
                        "a limpeza cuidadosa e compareça às consultas."
                },
                {
                    etiqueta: "Resultado individual",
                    titulo: "Acompanhamento dos resultados",
                    imagem:
                        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados de saúde oral",
                    descricao:
                        "A evolução depende da condição inicial, do crescimento " +
                        "quando aplicável e da resposta individual ao tratamento.",
                    solucao:
                        "O profissional acompanha o progresso e ajusta o plano " +
                        "quando necessário. A duração varia de pessoa para pessoa."
                }
            ]
        },

        estetica: {
            titulo: "Estética dentária",
            introducao:
                "Os cuidados de estética dentária podem ajudar a melhorar " +
                "a aparência do sorriso. A opção adequada depende da saúde " +
                "dos dentes e das gengivas.",

            detalhes: [
                {
                    etiqueta: "Cor dos dentes",
                    titulo: "Manchas e alterações de cor",
                    imagem:
                        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados de estética dentária",
                    descricao:
                        "Algumas manchas estão relacionadas com alimentos, " +
                        "bebidas, tabaco ou outras alterações da estrutura dentária.",
                    solucao:
                        "Conforme a causa, podem ser indicados uma limpeza " +
                        "profissional ou um branqueamento supervisionado."
                },
                {
                    etiqueta: "Forma dos dentes",
                    titulo: "Dentes lascados ou irregulares",
                    imagem:
                        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de consulta dentária",
                    descricao:
                        "Pequenas fraturas e irregularidades podem alterar " +
                        "a aparência dos dentes.",
                    solucao:
                        "Dependendo do caso, o profissional pode considerar " +
                        "restauração estética ou outras opções conservadoras."
                },
                {
                    etiqueta: "Restauração",
                    titulo: "Dentes com danos visíveis",
                    imagem:
                        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados dentários",
                    descricao:
                        "Um dente danificado pode precisar de tratamento " +
                        "para recuperar a função e melhorar a aparência.",
                    solucao:
                        "A solução depende da extensão do dano e pode incluir " +
                        "uma restauração ou uma coroa."
                },
                {
                    etiqueta: "Planeamento",
                    titulo: "Melhoria do sorriso",
                    imagem:
                        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80",
                    alt: "Imagem ilustrativa de cuidados estéticos",
                    descricao:
                        "Cada sorriso tem características próprias e nem todos " +
                        "os procedimentos são indicados para todas as pessoas.",
                    solucao:
                        "Uma avaliação permite discutir as opções, os benefícios, " +
                        "as limitações e os cuidados necessários."
                }
            ]
        }
    };

    


    /* ==========================================
       9. PAINEL INTERATIVO DOS SERVIÇOS
    ========================================== */

    const botoesServicos = document.querySelectorAll(".botao-detalhes-servico");
    const cartoesServicos = document.querySelectorAll("#carrossel-tratamentos .cartao-conteudo");
    
/* ==========================================
   CARROSSÉIS AUTOMÁTICOS NOS CARTÕES
========================================== */

function iniciarCarrosseisDosCartoes() {

    cartoesServicos.forEach(function (cartao) {

        const imagemOriginal = cartao.querySelector(":scope > img");
        const botao = cartao.querySelector(".botao-detalhes-servico");

        if (!imagemOriginal || !botao) {
            return;
        }

        const chave = botao.dataset.servico;
        const servico = dadosServicos[chave];

        if (!servico || !servico.detalhes || servico.detalhes.length === 0) {
            return;
        }

        const detalhes = servico.detalhes;

        const carrossel = document.createElement("div");
        carrossel.className = "carrossel-imagens-servico";

        detalhes.forEach(function (detalhe, indice) {

            const imagem = document.createElement("img");

            imagem.src = detalhe.imagem;
            imagem.alt = detalhe.alt || detalhe.titulo;
            imagem.className = "imagem-carrossel-servico";

            if (indice === 0) {
                imagem.classList.add("ativa");
            }

            imagem.loading = indice === 0 ? "eager" : "lazy";
            imagem.decoding = "async";

            carrossel.appendChild(imagem);

        });

        imagemOriginal.replaceWith(carrossel);

        if (detalhes.length < 2) {
            return;
        }

        let indiceAtual = 0;

        window.setInterval(function () {

            if (document.hidden) {
                return;
            }

            const imagens = carrossel.querySelectorAll(
                ".imagem-carrossel-servico"
            );

            imagens[indiceAtual].classList.remove("ativa");

            indiceAtual = (indiceAtual + 1) % imagens.length;

            imagens[indiceAtual].classList.add("ativa");

        }, 2000);

    });

}

iniciarCarrosseisDosCartoes();
/* O painel dos serviços continua abaixo */

    const painelServicos = document.querySelector("#painel-detalhes-servico");
    const etiquetaPainel = document.querySelector("#etiqueta-detalhe-servico");
    const tituloPainel = document.querySelector("#titulo-detalhe-servico");
    const conteudoPainel = document.querySelector("#detalhe-servico-conteudo");
    const indicadoresPainel = document.querySelector("#indicadores-detalhe-servico");

    let botaoServicoAtivo = null;
    let indiceDetalheAtual = 0;
    let temporizadorDetalhes = null;
    let temporizadorTransicao = null;
    let numeroAnimacaoPainel = 0;

    const nomesServicos = {
        avaliacao: "Consulta de avaliação",
        higiene: "Higiene oral",
        ortodontia: "Ortodontia",
        estetica: "Estética dentária"

    };

    function selecionarServicoNoFormulario(chave) {
        const campoServico = document.querySelector("#servico");

        if (campoServico && nomesServicos[chave]) {
            campoServico.value = nomesServicos[chave];
            campoServico.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function pararRotacaoDetalhes() {
        if (temporizadorDetalhes !== null) {
            clearInterval(temporizadorDetalhes);
            temporizadorDetalhes = null;
        }

        if (temporizadorTransicao !== null) {
            clearTimeout(temporizadorTransicao);
            temporizadorTransicao = null;
        }
    }

    function mostrarDetalhe(indice) {
        const chave = botaoServicoAtivo?.dataset.servico;
        const servico = dadosServicos[chave];

        if (!servico || !servico.detalhes || !servico.detalhes.length) {
            return;
        }

        const total = servico.detalhes.length;
        indiceDetalheAtual = (indice + total) % total;
        const detalhe = servico.detalhes[indiceDetalheAtual];

        if (temporizadorTransicao !== null) {
            clearTimeout(temporizadorTransicao);
            temporizadorTransicao = null;
        }

        conteudoPainel.classList.remove("detalhe-visivel");
        conteudoPainel.classList.add("detalhe-em-transicao");

        const atraso = prefereMovimentoReduzido.matches ? 0 : 250;

        temporizadorTransicao = setTimeout(function () {
            if (!botaoServicoAtivo || !painelServicos || painelServicos.hidden) {
                return;
            }

            const artigo = document.createElement("article");
            artigo.className = "detalhe-unico";

            const imagem = document.createElement("img");
            imagem.src = detalhe.imagem;
            imagem.alt = detalhe.alt;
            imagem.loading = "lazy";

            const texto = document.createElement("div");
            texto.className = "detalhe-texto";

            const etiqueta = document.createElement("span");
            etiqueta.className = "etiqueta-detalhe";
            etiqueta.textContent = detalhe.etiqueta;

            const titulo = document.createElement("h4");
            titulo.textContent = detalhe.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = detalhe.descricao;

            const solucao = document.createElement("p");
            const rotulo = document.createElement("strong");
            rotulo.textContent = "Possível solução: ";
            solucao.append(rotulo, document.createTextNode(detalhe.solucao));

            const botaoMarcar = document.createElement("button");
            botaoMarcar.type = "button";
            botaoMarcar.className = "botao-marcar-detalhe";
            botaoMarcar.textContent = "Marcar consulta";

            botaoMarcar.addEventListener("click", function () {
                selecionarServicoNoFormulario(chave);

                const marcacao = document.querySelector("#marcacao");

                if (marcacao) {
                    marcacao.scrollIntoView({
                        behavior: prefereMovimentoReduzido.matches ? "auto" : "smooth",
                        block: "start"
                    });
                }
            });

            texto.append(etiqueta, titulo, descricao, solucao, botaoMarcar);
            artigo.append(imagem, texto);

            conteudoPainel.replaceChildren(artigo);
            etiquetaPainel.textContent = detalhe.etiqueta;
            tituloPainel.textContent = servico.titulo;

            indicadoresPainel.replaceChildren();

            servico.detalhes.forEach(function (item, i) {
                const indicador = document.createElement("button");
                indicador.type = "button";
                indicador.className = "indicador-detalhe";
                indicador.setAttribute("aria-label", "Ver detalhe " + (i + 1) + ": " + item.titulo);
                indicador.setAttribute("aria-current", i === indiceDetalheAtual ? "true" : "false");

                if (i === indiceDetalheAtual) {
                    indicador.classList.add("ativo");
                }

                indicador.addEventListener("click", function () {
                    pararRotacaoDetalhes();
                    mostrarDetalhe(i);
                    iniciarRotacaoDetalhes();
                });

                indicadoresPainel.appendChild(indicador);
            });

            conteudoPainel.classList.remove("detalhe-em-transicao");
            conteudoPainel.classList.add("detalhe-visivel");
            temporizadorTransicao = null;
        }, atraso);
    }

    

function iniciarRotacaoDetalhes() {
    if (temporizadorDetalhes !== null) {
        clearInterval(temporizadorDetalhes);
        temporizadorDetalhes = null;
    }

    // A rotação automática fica desativada.
    return;
}

function posicionarPainel(cartao) {
    if (!cartao || !painelServicos) return;

    const secao = document.querySelector(".secao-servicos");

    if (!secao) return;

    const cartaoRect = cartao.getBoundingClientRect();
    const secaoRect = secao.getBoundingClientRect();

    painelServicos.style.top =
        (cartaoRect.top - secaoRect.top + secao.scrollTop) + "px";

    painelServicos.style.left =
        (cartaoRect.left - secaoRect.left + secao.scrollLeft) + "px";

    painelServicos.style.width = cartaoRect.width + "px";
    painelServicos.style.height = cartaoRect.height + "px";
}

    function abrirPainelServico(chave, botao) {
        if (!dadosServicos[chave] || !painelServicos || !conteudoPainel) {
            return;
        }

        pararRotacaoDetalhes();
        numeroAnimacaoPainel++;

        botaoServicoAtivo = botao;
        botaoServicoAtivo = botao;

const cartaoAtivo = botao.closest(".cartao-conteudo");

if (cartaoAtivo) {
    posicionarPainel(cartaoAtivo);
}

painelServicos.hidden = false;
        painelServicos.setAttribute("aria-hidden", "false");
        painelServicos.classList.add("painel-aberto");

        selecionarServicoNoFormulario(chave);
        mostrarDetalhe(0);
        iniciarRotacaoDetalhes();
    }

    function fecharPainelServico(devolverFoco) {
        pararRotacaoDetalhes();

        if (!painelServicos) {
            return;
        }

        const botaoAnterior = botaoServicoAtivo;

        numeroAnimacaoPainel++;
        botaoServicoAtivo = null;

        botoesServicos.forEach(function (botao) {
            botao.setAttribute("aria-expanded", "false");
        });

        painelServicos.classList.remove("painel-aberto");
        painelServicos.setAttribute("aria-hidden", "true");
        painelServicos.hidden = true;

        if (devolverFoco && botaoAnterior) {
            botaoAnterior.focus();
        }
    }

    botoesServicos.forEach(function (botao) {
        botao.addEventListener("click", function () {
            abrirPainelServico(botao.dataset.servico, botao);
        });
    });
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharPainelServico(true);
        }
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            pararRotacaoDetalhes();
        } else if (botaoServicoAtivo) {
            iniciarRotacaoDetalhes();
        }
    });

});
