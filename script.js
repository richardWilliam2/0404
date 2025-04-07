/**
 * Obtém os dados de pessoas do localStorage com tratamento de erro.
 * @returns {Array} O array de pessoas ou um array vazio.
 */

function calcularIdade(dataNascimento) {
    // Verifica se a data de nascimento foi fornecida
    if (!dataNascimento) {
        return "Inválida"; // Retorna "Inválida" se a data estiver vazia
    }
    try {
        // Obtém a data atual
        const hoje = new Date();
        // Cria um objeto Date para a data de nascimento
        const nascimento = new Date(dataNascimento + 'T00:00:00');

        // Verifica se a data de nascimento é válida
        if (isNaN(nascimento.getTime())) {
            return "Inválida"; // Retorna "Inválida" se a data não for reconhecida
        }

        // Calcula a diferença inicial em anos
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        // Calcula a diferença em meses
        const mes = hoje.getMonth() - nascimento.getMonth();

        // Ajusta a idade se o aniversário ainda não ocorreu este ano
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--; // Decrementa a idade
        }
        // Garante que a idade não seja negativa
        return idade >= 0 ? idade : 0;
    } catch (e) {
        // Captura e loga qualquer erro inesperado
        console.error("Erro ao calcular idade:", e);
        return "Erro"; // Retorna "Erro" em caso de exceção
    }
}


function getPessoasLocalStorage() {
    // Tenta obter a string JSON do localStorage
    const pessoasStr = localStorage.getItem("pessoas");
    // Retorna array vazio se não houver nada
    if (!pessoasStr) {
        return [];
    }
    try {
        // Tenta converter a string JSON para um array
        const pessoasArray = JSON.parse(pessoasStr);
        // Verifica se é um array e retorna, senão retorna array vazio
        return Array.isArray(pessoasArray) ? pessoasArray : [];
    } catch (e) {
        // Loga erros de conversão JSON
        console.error("Erro ao ler dados do localStorage:", e);
        // Retorna array vazio em caso de erro
        return [];
    }
}

/**
 * Salva o array de pessoas no localStorage.
 * @param {Array} pessoasArray - O array de objetos pessoa a ser salvo.
 */
function salvarPessoasLocalStorage(pessoasArray) {
    try {
        // Converte o array para string JSON
        const pessoasStr = JSON.stringify(pessoasArray);
        // Armazena no localStorage
        localStorage.setItem("pessoas", pessoasStr);
    } catch (e) {
        // Loga erros de conversão ou salvamento
        console.error("Erro ao salvar dados no localStorage:", e);
        // Alerta o usuário
        alert("Erro ao salvar os dados. Verifique o console.");
    }
}

// --- Funções de Validação e Formulário ---

/**
 * Valida os campos obrigatórios (ID, Nome, Data de Nascimento) e o formato da data.
 * @returns {boolean} True se o formulário for válido, False caso contrário.
 */
function validarFormulario() {
    // Obtém os valores dos campos
    const id = document.getElementById("id").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;

    // Verifica campos obrigatórios
    if (!id || !nome || !dataNascimento) {
        alert("Por favor, preencha os campos obrigatórios: ID, Nome Completo e Data de Nascimento.");
        return false;
    }

    // Verifica formato básico da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
        alert("Formato da Data de Nascimento inválido. Use AAAA-MM-DD.");
        return false;
    }

    // Verifica se a data é válida usando a função de calcular idade
    if (calcularIdade(dataNascimento) === "Inválida") {
        alert("Data de Nascimento inválida. Verifique o dia, mês e ano.");
        return false;
    }

    // Retorna verdadeiro se passou nas validações
    return true;
}

/**
 * Limpa todos os campos do formulário e reseta o estado do campo ID.
 */
function limparFormulario() {
    // Obtém referências aos elementos
    const form = document.getElementById("meuFormulario");
    const idInput = document.getElementById("id");
    const idadeInput = document.getElementById("idadeInput");

    // Reseta o formulário
    if (form) {
        form.reset();
    }
    // Garante que ID seja editável após limpar
    if (idInput) {
        idInput.readOnly = false;
    }
    // Limpa e mantém idade como readonly
    if (idadeInput) {
        idadeInput.value = '';
        idadeInput.readOnly = true;
    }
}

// --- Funções CRUD (Create, Read, Update, Delete) ---

/**
 * Salva uma nova pessoa ou atualiza uma existente no localStorage.
 */
/**
 * Salva (adiciona ou atualiza) uma pessoa no localStorage.
 * - Se o ID estiver editável (modo Adicionar): impede a adição se o ID já existir.
 * - Se o ID NÃO estiver editável (modo Atualizar): atualiza o registro existente.
 */
function salvar() {
    // 1. Valida o formulário primeiro
    if (!validarFormulario()) {
        return; // Interrompe se a validação falhar
    }

    // 2. Obtém os valores dos campos do formulário
    const idInput = document.getElementById("id"); // Pega o elemento input do ID
    const id = idInput.value.trim();               // Pega o valor do ID
    const isUpdating = idInput.readOnly;         // Verifica se o campo ID está bloqueado (true se estiver atualizando)

    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const uf = document.getElementById("uf").value.trim().toUpperCase();
    const dataNascimento = document.getEle21mentById("dataNascimento").value;

    // 3. Cria o objeto 'pessoa' com os dados coletados
    const pessoa = { id, nome, endereco, cep, bairro, uf, dataNascimento };

    // 4. Obtém a lista atual de pessoas do localStorage
    let pessoas = getPessoasLocalStorage();
    // Procura pelo índice da pessoa com o mesmo ID na lista
    const index = pessoas.findIndex(p => p.id === id);

    //Decide a ação baseadase é uma atualização ou adição
    if(isUpdating){
        //------Modo de Atualuização
        if(index!==-1){
            //ID encontrado, como esperando para atualização
            pessoas[index] = pessoa; //Atualizada os dados da pessoa existente no array
            alert(`Dados da pessoa com ID/CPF'${id} atualização com sucesso`) //pesquise sobre JQuery; uma bibliorteca
            salvarPessoasLocalStorage(pessoa); //Salva o array modificado
            limparFormulario();//Chama a função para limpar o forms
        }else{
            //caso ocorra algum erro
            alert(`Erro as atualizar o ID/CPF ${id}`)

        }

    }else{
        //--- modo de edição ID está editavel
        if(index !== -1){
            //Erro tentando adicionar o ID que já existe
            alert(`Erro, já existe esse usuario ' ${id}`)
            idInput.focus(); // verificando se já exxiste o id
        }else{
            pessoas.push(pessoa)// adiciona mais um elemento no array
            alert(`Pessoa com ID/CPF ${id} cadastrado com sucesso`);
            salvarPessoasLocalStorage(pessoas); //Salva o array atualizado
            limparFormulario(); //limpa o formulario
        ;}
    };
};

/**
 * preenche o formulario com os dados da pessoa para edição
 * 
 * 
 * @param {string} idParaEdit
 * Define o nome, tipo e descrição do parametro
 * 
 * 
 */

function editar(idParaEdit){
    //obtem a lista de pessoas
    const pessoas = getPessoasLocalStorage();
    //Encontra  pessoas pelo ID
    const pessoa = pessoa.find(p =>p.id === idParaEdit)

    // Verificva se a pessoa foi encontrada
    if(!pessoas){
        alert(`Pessoa não encontrada para edição. id: ${idParaEdit}`)
        return
    }
}

// Obtem referencias aos capos do formulario
const idInput = document.getElementById('id');
const idadeInput = document.getElementById('IdadeInput');

// Preenche o formulario aos campos do formulario

idInput.value = pessoa.id;