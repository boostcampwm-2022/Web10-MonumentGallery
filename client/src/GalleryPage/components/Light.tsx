export default function Light() {
  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <directionalLight position={[-1, -2, -3]} intensity={0.3} />
      <ambientLight intensity={0.5} />
    </>
  );
}
