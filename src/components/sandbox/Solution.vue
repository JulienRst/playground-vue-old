<template>
	<div class="render">
		<h1 class="loading">{{ (endOfAnimation) ? 'ONEPOINT Solution' : 'LOADING' }}</h1>
		<div class="loader" :class="{ active: !loadEnd }">
			{{ percent }}<span class="percent-symbol">%</span>
			<div class="inner-loader" :style="{ height: loadPercent + '%' }">
				{{ percent }}<span class="percent-symbol">%</span>
			</div>
		</div>
		<div class="home row center" :class="{ active: endOfAnimation }">
			<div class="container-home column">
				<div class="frontground column">
					<div class="title">We make the futur awesome<span class="asterix">*</span></div>
					<div class="btn btn-pink">Découvrez l'univers Solution</div>
				</div>
				<div class="background column">
					<div class="text">
						La communauté Solutions de Onepoint rassemble des profils pluridisciplinaires du numérique afin de proposer des réponses complètes et innovantes aux entreprises en mutation.
					</div>
				</div>
			</div>
			<div class="lava-container front">
				<lavaball></lavaball>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Lavaball from './Lavaball.vue';

@Component({
	name: 'About',
	components: {
		Lavaball
	}
})
export default class App extends Vue {
	public loadPercent: number = 0;
	public loadEnd: boolean = false;
	private interval: number = 0;
	private endOfAnimation: boolean = false;

	public mounted () {
		this.interval = window.setInterval(() => {
			if (this.loadPercent < 100) {
				this.loadPercent ++;
			} else {
				window.clearInterval(this.interval);
				this.loadEnd = true;
				window.setTimeout(() => { this.endOfAnimation = true; }, 500);
			}
		}, 10);
	}

	get percent () {
		return (this.loadPercent < 100) ? ('00' + this.loadPercent).slice(-2) : 100;
	}
}
</script>

<style lang="scss" scoped>
.render {
  width: 100%;
  min-height: 100%;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  position: relative;
  letter-spacing: 3px;
  
  h1 {
    text-transform: uppercase;
    font-size: 1rem;
  }

  .loading {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .loader {
    position: absolute;
    top: 25%;
    left: 50%;
    font-size: 4rem;
    font-weight: bold;
    transform: translate(-50%, -50%);
    color: #444444;
    line-height: 3.25rem;
    opacity: 0;
    transition: 1.0s;

    .percent-symbol {
      font-size: 1.5rem;
    }

    &.active {
      opacity: 1;
      top: 50%;
      transition: 1.0s;
    }

    .inner-loader {
      position: absolute;
      color: white;
      width: 100%;
      overflow: hidden;
      top: 0;
      left: 0;
    }
  }
}

.home {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  transform: translateY(-50%);
  opacity: 0;
  transition: 0.5s;

  &.active {
    transform: none;
    opacity: 1;
    transition: 0.5s;
  }


  .container-home {
    top: 50%;
    left: 45%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 50%;
    height: 100%;
    justify-content: space-around;
    align-items: center;

    .frontground {
      position: absolute;
      z-index: 10;
      align-items: flex-start;

      .title {
        font-size: 4rem;
        max-width: 550px;
        font-weight: bold;
      }

      .btn {
        margin-top: 1rem;
      }
    }

    .background {
      position: absolute;
      left: 65%;
      top: 55%;
      border: 1rem solid #06e3e6;
      width: 25rem;
      height: 25rem;
      z-index: 1;
      transform: translateY(-50%);
      padding: 2rem;
      padding-bottom: 3rem;
      justify-content: flex-end;

      .text {
        font-weight: 100;
        letter-spacing: 0;
      }

      &::before {
        z-index: 2;
        content: '';
        position: absolute;
        width: 10rem;
        height: 10rem;
        top: 1.5rem;
        left: 0;
        transform: translate(-50%);
        background: #101010;
      }

      &::after {
        z-index: 0;
        content: '';
        position: absolute;
        top: -1rem;
        left: -1rem;
        width: calc(100% + 2rem);
        height: calc(100% + 2rem);
        box-shadow: 0 5px 15px rgba(#06e3e6, 0.3);
      }
    }
  }
}

.lava-container {
  position: fixed;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>

