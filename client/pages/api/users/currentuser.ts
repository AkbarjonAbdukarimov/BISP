export default function handler(req, res) {
  res.status(200).json({ currentUser: { email: "jon doe", id: "asdasd" } });
}
