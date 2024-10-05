import React from "react";

// Idea: Have people validate their panoramas with their email?
export default async function Panorama() {
  return (
    <>
      <main>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="file" multiple={true} />
        </form>
      </main>
    </>
  );
}
