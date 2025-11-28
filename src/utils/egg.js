function getEggByStage(stage) {
  switch (stage) {
    case 0:
      return eggImg;
    case 1:
      return eggBreak1;
    case 2:
      return eggBreak2;
    case 3:
      return eggBreak3;
    case 4:
      return eggBreak4;
    default:
      return eggBreak4;
  }
}
