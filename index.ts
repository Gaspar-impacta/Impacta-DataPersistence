import { PrismaClient, User, Author, Post, Comment } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser(user: Omit<User, "id">) {
  const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (existingUser) {
    console.log(`Usuário com o e-mail ${user.email} já existe.`);
    return existingUser;
  }
  const newUser = await prisma.user.create({ data: user });
  console.log("Usuário criado:", newUser);
  return newUser;
}

async function listUsers() {
  const users = await prisma.user.findMany();
  console.log("Lista de usuários:", users);
  return users;
}

async function listUsersInclude() {
  const users = await prisma.user.findMany({
    include: {
      authors: {
        include: {
          posts: true,
        },
      },
      comments: true,
    },
  });
  console.log("Lista de usuários com autores, posts e comentários: (include)", users);
  return users;
}


async function updateUser(id: number, user: Omit<User, "id">) {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: user.email,
      id: {
        not: id
      },
    },
  });

  if (existingUser) {
    console.log(`O e-mail ${user.email} já está em uso.`);
    return null;
  }

  const updatedUser = await prisma.user.update({ where: { id }, data: user });
  console.log("Usuário atualizado:", updatedUser);
  return updatedUser;
}

async function deleteUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    console.log(`Usuário com o e-mail ${email} não encontrado.`);
    return;
  }
  const deletedUser = await prisma.user.delete({ where: { email } });
  console.log(`Usuário com o e-mail ${email} foi deletado:`, deletedUser);
}

async function deleteUsers() {
  try {
    const deleteResult = await prisma.user.deleteMany();
    console.log("Todos os usuários foram deletados.");
  } catch (error) {
    console.error(error);
  }
}

async function createAuthor(author: Omit<Author, "id">) {
  const newAuthor = await prisma.author.create({ data: author });
  console.log("Autor criado:", newAuthor);
  return newAuthor;
}

async function listAuthors() {
  const authors = await prisma.author.findMany();
  console.log("Lista de autores:", authors);
  return authors;
}

async function updateAuthor(id: number, author: Omit<Author, "id">) {
  const updatedAuthor = await prisma.author.update({ where: { id }, data: author });
  console.log("Autor atualizado:", updatedAuthor);
  return updatedAuthor;
}

async function deleteAuthor(id: number) {
  const deletedAuthor = await prisma.author.delete({ where: { id } });
  console.log("Autor deletado:", deletedAuthor);
}

async function createPost(post: Omit<Post, "id">) {
  const newPost = await prisma.post.create({ data: post });
  console.log("Post criado:", newPost);
  return newPost;
}

async function listPosts() {
  const posts = await prisma.post.findMany();
  console.log("Lista de posts:", posts);
  return posts;
}

async function updatePost(id: number, post: Omit<Post, "id">) {
  const updatedPost = await prisma.post.update({ where: { id }, data: post });
  console.log("Post atualizado:", updatedPost);
  return updatedPost;
}

async function deletePost(id: number) {
  const deletedPost = await prisma.post.delete({ where: { id } });
  console.log("Post deletado:", deletedPost);
}

async function createComment(comment: Omit<Comment, "id">) {
  const newComment = await prisma.comment.create({ data: comment });
  console.log("Comentário criado:", newComment);
  return newComment;
}

async function listComments() {
  const comments = await prisma.comment.findMany();
  console.log("Lista de comentários:", comments);
  return comments;
}

async function updateComment(id: number, data: Partial<Omit<Comment, "id">>) {
  const updatedComment = await prisma.comment.update({ where: { id }, data });
  console.log("Comentário atualizado:", updatedComment);
  return updatedComment;
}

async function deleteComment(id: number) {
  const deletedComment = await prisma.comment.delete({ where: { id } });
  console.log("Comentário deletado:", deletedComment);
}

async function main() {
  console.log("--- CRIANDO REGISTROS ---");

  const user1 = await createUser({ name: "Emílio", email: "emilio@hotmail.com" });
  const user2 = await createUser({ name: "Guilherme", email: "guilherme@gmail.com" });
  const user3 = await createUser({ name: "JAUM", email: "joao@yahoo.com" });

  const author1 = await createAuthor({ userId: user1.id, tags: "Carros", surname: "Murta", completeName: "Emílio Murta" });
  const author2 = await createAuthor({ userId: user2.id, tags: "Atividade", surname: "Gaspar", completeName: "Guilherme Gaspar" });
  const author3 = await createAuthor({ userId: user3.id, tags: "Receita de PÃO", surname: "Silva", completeName: "João Silvazzzz" });

  const post1 = await createPost({ authorId: author1.id, title: "Vendo minha Ferrari F355", text: "Estou vendendo minha Ferrari F355. Carro de garagem!" });
  const post2 = await createPost({ authorId: author2.id, title: "Atividade com prisma ORM", text: "Está é minha atividade usando prisma ORM." });
  const post3 = await createPost({ authorId: author3.id, title: "Bolo de BANANA", text: "Aqui vai a receita de um delicioso bolo de BANANA: 2 ovos, farinha, manteiga, chocolate em pó e fermento." });

  const comment1 = await createComment({ userId: user1.id, postId: post1.id, text: "Está com apenas 38000 km rodados!" });
  const comment2 = await createComment({ userId: user2.id, postId: post2.id, text: "Minha atividade está ficando muito boa!" });
  const comment3 = await createComment({ userId: user3.id, postId: post3.id, text: "faltou acrescentar um pouco de óleo." });

  console.log("Atualizando o comentário de João...");
  await updateComment(comment3.id, { text: "Faltou acrescentar óleo e um pouco de água também." });

  console.log("Atualizando o post de João...");
  await updatePost(post3.id, { authorId: author3.id, title: "Bolo de CHOCOLATE", text: "Aqui vai a receita de um delicioso bolo de CHOCOLATE: 2 ovos, farinha, manteiga, chocolate em pó e fermento." });

  console.log("Atualizando o autor João...");
  await updateAuthor(author3.id, { userId: user3.id, tags: "Receita de BOLO", surname: "Silva", completeName: "João Silva" });

  console.log("Atualizando o usuário João...");
  await updateUser(user3.id, { name: "João", email: "joaosilva@gmail.com" });

  console.log("Deletando o comentário de João...");
  await deleteComment(comment3.id);

  console.log("Deletando o post de João...");
  await deletePost(post3.id);

  console.log("Deletando o autor João...");
  await deleteAuthor(author3.id);

  await listUsersInclude();

  console.log("Deletando o usuário Emílio (Cascade)");
  const emailToDelete = "emilio@hotmail.com";
  await deleteUserByEmail(emailToDelete);
  await listUsersInclude();

  console.log("Deletando todos os usuários...");
  await deleteUsers();
  await listUsersInclude();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    console.log(e);
    process.exit(1);
  });